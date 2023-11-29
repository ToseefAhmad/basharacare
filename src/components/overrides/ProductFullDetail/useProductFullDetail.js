import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useState, useMemo } from 'react';
import { useLocation } from 'react-router-dom/cjs/react-router-dom.min';

import { useToasts } from '@app/hooks/useToasts';
import { useTracking } from '@app/hooks/useTracking';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';
import defaultOperations from '@magento/peregrine/lib/talons/ProductFullDetail/productFullDetail.gql';
import { appendOptionsToPayload } from '@magento/peregrine/lib/util/appendOptionsToPayload';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { findMatchingVariant } from '@magento/peregrine/lib/util/findMatchingProductVariant';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { isSupportedProductType as isSupported } from '@magento/peregrine/lib/util/isSupportedProductType';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import classes from './productFullDetail.module.css';

const INITIAL_OPTION_CODES = new Map();
const INITIAL_OPTION_SELECTIONS = new Map();
const OUT_OF_STOCK_CODE = 'OUT_OF_STOCK';

const deriveOptionCodesFromProduct = product => {
    // If this is a simple product it has no option codes.
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_CODES;
    }

    // Initialize optionCodes based on the options of the product.
    const initialOptionCodes = new Map();
    for (const { attribute_id, attribute_code } of product.configurable_options) {
        initialOptionCodes.set(attribute_id, attribute_code);
    }

    return initialOptionCodes;
};

// Similar to deriving the initial codes for each option.
const deriveOptionSelectionsFromProduct = product => {
    if (!isProductConfigurable(product)) {
        return INITIAL_OPTION_SELECTIONS;
    }

    const initialOptionSelections = new Map();
    for (const { attribute_id } of product.configurable_options) {
        initialOptionSelections.set(attribute_id, undefined);
    }

    return initialOptionSelections;
};

const isProductSelected = (item, selectedProduct) => {
    return item.attributes.every(element => {
        if (typeof selectedProduct.get(element.code) === 'undefined') {
            return true;
        }

        return element['value_index'] === selectedProduct.get(element.code);
    });
};

const getIsMissingOptions = (product, optionSelections) => {
    // Non-configurable products can't be missing options.
    if (!isProductConfigurable(product)) {
        return false;
    }

    // Configurable products are missing options if we have fewer
    // Option selections than the product has options.
    const { configurable_options } = product;
    const numProductOptions = configurable_options.length;
    const numProductSelections = Array.from(optionSelections.values()).filter(value => !!value).length;

    return numProductSelections < numProductOptions;
};

const getIsOutOfStock = (product, optionCodes, optionSelections) => {
    const { stock_status, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (isConfigurable && optionsSelected) {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        return item.product.stock_status === OUT_OF_STOCK_CODE;
    }
    return stock_status === OUT_OF_STOCK_CODE;
};

const addDefaultLabel = (images, label) => {
    images.forEach(image => (image.label = image.label || label));

    return images;
};

const getMediaGalleryEntries = (product, optionCodes, optionSelections) => {
    let value = [];

    const { media_gallery_entries, variants } = product;
    const isConfigurable = isProductConfigurable(product);

    // Selections are initialized to "code => undefined". Once we select a value, like color, the selections change. This filters out unselected options.
    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (!isConfigurable || !optionsSelected) {
        value = media_gallery_entries;
    } else {
        /* If any of the possible variants matches the selection add that
        variant's image to the media gallery. NOTE: This _can_, and does,
        include variants such as size. If Magento is configured to display
        an image for a size attribute, it will render that image. **/
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        value = item ? [...item.product.media_gallery_entries, ...media_gallery_entries] : media_gallery_entries;
    }

    return addDefaultLabel(value, product.name);
};

/* We only want to display breadcrumbs for one category on a PDP even if a
product has multiple related categories. This function filters and selects
one category id for that purpose. **/
const getBreadcrumbCategoryId = categories => {
    // Exit if there are no categories for this product.
    if (!categories || !categories.length) {
        return;
    }

    const filteredCategories = categories.filter(cat => cat.level > 1);

    const breadcrumbSet = new Set();
    filteredCategories.forEach(({ breadcrumbs }) => {
        // Breadcrumbs can be `null`...
        (breadcrumbs || []).forEach(({ category_id }) => breadcrumbSet.add(category_id));
    });

    /* Until we can get the single canonical breadcrumb path to a product we
    will just return the first category id of the potential leaf categories. **/
    const leafCategory = filteredCategories.find(category => !breadcrumbSet.has(category?.uid));
    /* If we couldn't find a leaf category then just use the first category
    in the list for this product. **/
    return leafCategory?.uid || filteredCategories[0]?.uid;
};

const getCustomAttributes = (product, optionCodes, optionSelections) => {
    const { custom_attributes, variants } = product;
    const isConfigurable = isProductConfigurable(product);
    const optionsSelected = Array.from(optionSelections.values()).filter(value => !!value).length > 0;

    if (isConfigurable && optionsSelected) {
        const item = findMatchingVariant({
            optionCodes,
            optionSelections,
            variants
        });

        return item.product.custom_attributes;
    }

    return custom_attributes;
};

/**
 * @param {GraphQLDocument} props.addConfigurableProductToCartMutation - configurable product mutation
 * @param {GraphQLDocument} props.addSimpleProductToCartMutation - configurable product mutation
 * @param {Object.<string, GraphQLDocument>} props.operations - collection of operation overrides merged into defaults
 * @param {Object} props.product - the product, see RootComponents/Product
 *
 * @returns {{
 *  breadcrumbCategoryId: string|undefined,
 *  errorMessage: string|undefined,
 *  handleAddToCart: func,
 *  handleSelectionChange: func,
 *  handleSetQuantity: func,
 *  isAddToCartDisabled: boolean,
 *  isSupportedProductType: boolean,
 *  mediaGalleryEntries: array,
 *  productDetails: object,
 *  quantity: number
 * }}
 */
export const useProductFullDetail = props => {
    const { addConfigurableProductToCartMutation, addSimpleProductToCartMutation, product } = props;

    const [, { addToast }] = useToasts();
    const [
        ,
        {
            actions: { setCartPopUp }
        }
    ] = useAppContext();
    const { trackAddToCart, getProductCategories } = useTracking();

    const hasDeprecatedOperationProp = !!(addConfigurableProductToCartMutation || addSimpleProductToCartMutation);

    const operations = mergeOperations(defaultOperations, props.operations);

    const productType = product.__typename;

    const isSupportedProductType = isSupported(productType);

    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    const { data: storeConfigData } = useQuery(operations.getWishlistConfigQuery, {
        fetchPolicy: 'cache-only'
    });

    // eslint-disable-next-line no-console
    const { uid } = product;
    const location = useLocation();
    const algoliaQueryID = getSearchParam('queryID', location);

    const { data: deliveryData } = useQuery(operations.getProductDeliveryDate, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            uid
        }
    });

    const [
        addConfigurableProductToCart,
        { error: errorAddingConfigurableProduct, loading: isAddConfigurableLoading }
    ] = useMutation(addConfigurableProductToCartMutation || operations.addConfigurableProductToCartMutation);

    const [addSimpleProductToCart, { error: errorAddingSimpleProduct, loading: isAddSimpleLoading }] = useMutation(
        addSimpleProductToCartMutation || operations.addSimpleProductToCartMutation
    );

    const [addProductToCart, { error: errorAddingProductToCart, loading: isAddProductLoading }] = useMutation(
        operations.addProductToCartMutation
    );

    const breadcrumbCategoryId = useMemo(() => getBreadcrumbCategoryId(product.categories), [product.categories]);

    const derivedOptionSelections = useMemo(() => deriveOptionSelectionsFromProduct(product), [product]);

    const [optionSelections, setOptionSelections] = useState(derivedOptionSelections);

    const derivedOptionCodes = useMemo(() => deriveOptionCodesFromProduct(product), [product]);
    const [optionCodes] = useState(derivedOptionCodes);

    const isMissingOptions = useMemo(() => getIsMissingOptions(product, optionSelections), [product, optionSelections]);

    const isOutOfStock = useMemo(() => getIsOutOfStock(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    const mediaGalleryEntries = useMemo(() => getMediaGalleryEntries(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    const customAttributes = useMemo(() => getCustomAttributes(product, optionCodes, optionSelections), [
        product,
        optionCodes,
        optionSelections
    ]);

    // The map of ids to values (and their uids)
    // For example:
    // { "179" => [{ uid: "abc", value_index: 1 }, { uid: "def", value_index: 2 }]}
    const attributeIdToValuesMap = useMemo(() => {
        const map = new Map();
        // For simple items, this will be an empty map.
        const options = product.configurable_options || [];
        for (const { attribute_id, values } of options) {
            map.set(attribute_id, values);
        }
        return map;
    }, [product.configurable_options]);

    // An array of selected option uids. Useful for passing to mutations.
    // For example:
    // ["abc", "def"]
    const selectedOptionsArray = useMemo(() => {
        const selectedOptions = [];

        optionSelections.forEach((value, key) => {
            const values = attributeIdToValuesMap.get(key);

            const selectedValue = values.find(item => item.value_index === value);

            if (selectedValue) {
                selectedOptions.push(selectedValue.uid);
            }
        });
        return selectedOptions;
    }, [attributeIdToValuesMap, optionSelections]);

    const handleAddToCart = useCallback(
        async formValues => {
            const { quantity } = formValues;

            /*
                @deprecated in favor of general addProductsToCart mutation. Will support until the next MAJOR.
             */
            if (hasDeprecatedOperationProp) {
                const payload = {
                    item: product,
                    productType,
                    quantity
                };

                if (isProductConfigurable(product)) {
                    appendOptionsToPayload(payload, optionSelections, optionCodes);
                }

                if (isSupportedProductType) {
                    const variables = {
                        cartId,
                        parentSku: payload.parentSku,
                        product: payload.item,
                        quantity: payload.quantity,
                        sku: payload.item.sku,
                        algoliaQueryID
                    };
                    // Use the proper mutation for the type.
                    if (productType === 'SimpleProduct') {
                        try {
                            await addSimpleProductToCart({
                                variables
                            });
                        } catch {
                            return;
                        }
                    } else if (productType === 'ConfigurableProduct') {
                        try {
                            await addConfigurableProductToCart({
                                variables
                            });
                        } catch {
                            return;
                        }
                    }
                } else {
                    console.error('Unsupported product type. Cannot add to cart.');
                }
            } else {
                const variables = {
                    cartId,
                    product: {
                        sku: product.sku,
                        quantity,
                        algoliasearch_query_param: algoliaQueryID
                    },
                    entered_options: [
                        {
                            uid: product.uid,
                            value: product.name
                        }
                    ]
                };

                if (selectedOptionsArray.length) {
                    variables.product.selected_options = selectedOptionsArray;
                }

                try {
                    await addProductToCart({ variables });
                    setCartPopUp({ cartItem: { ...product, ...{ quantity: quantity } } });
                    trackAddToCart({
                        products: [
                            {
                                name: product.name,
                                sku: product.sku,
                                quantity,
                                price: product.price_range.maximum_price.final_price.value,
                                currency: product.price_range.maximum_price.final_price.currency,
                                category: getProductCategories(product.categories),
                                brand: product.brand_name
                            }
                        ]
                    });
                } catch (error) {
                    addToast({
                        type: 'error',
                        message: error.message
                    });
                    return;
                }

                // Trigger mini-cart pop-up
            }
        },
        [
            hasDeprecatedOperationProp,
            product,
            productType,
            isSupportedProductType,
            optionSelections,
            optionCodes,
            cartId,
            algoliaQueryID,
            addSimpleProductToCart,
            addConfigurableProductToCart,
            selectedOptionsArray,
            addProductToCart,
            setCartPopUp,
            trackAddToCart,
            getProductCategories,
            addToast
        ]
    );

    const handleSelectionChange = useCallback(
        (optionId, selection) => {
            /* We must create a new Map here so that React knows that the value
            of optionSelections has changed. **/
            const nextOptionSelections = new Map([...optionSelections]);
            nextOptionSelections.set(optionId, selection);
            setOptionSelections(nextOptionSelections);
        },
        [optionSelections]
    );

    const productDetails = {
        description: product.description,
        shortDescription: product.short_description.html,
        name: product.name,
        priceRange: product.price_range,
        sku: product.sku,
        brand: product.brand_name,
        brand_url: product.brand_url || null,
        review: {
            rating_summary: product?.rating_summary,
            review_count: product?.review_count
        },
        relatedProducts: product.related_products
    };

    const derivedErrorMessage = useMemo(
        () => deriveErrorMessage([errorAddingSimpleProduct, errorAddingConfigurableProduct, errorAddingProductToCart]),
        [errorAddingConfigurableProduct, errorAddingProductToCart, errorAddingSimpleProduct]
    );

    const wishlistItemOptions = useMemo(() => {
        const options = {
            quantity: 1,
            sku: product.sku
        };

        if (productType === 'ConfigurableProduct') {
            options.selected_options = selectedOptionsArray;
        }

        return options;
    }, [product, productType, selectedOptionsArray]);

    const wishlistButtonProps = {
        buttonText: null,
        classes: { root: classes.wishListButton, root_selected: classes.wishlistRootSelected },
        item: wishlistItemOptions,
        storeConfig: storeConfigData ? storeConfigData.storeConfig : {}
    };

    const selectedProduct = useMemo(() => {
        const result = new Map();

        if (optionSelections) {
            optionSelections.forEach((value, key) => {
                result.set(optionCodes.get(key), value);
            });
        }

        return result;
    }, [optionCodes, optionSelections]);

    const productsFromVariants = useMemo(() => {
        if (!product.variants) {
            return null;
        }

        const result = [];

        product.variants.forEach(item => {
            if (isProductSelected(item, selectedProduct)) {
                result.push(item.product.id);
            }
        });

        return product.variants.length === result.length ? [] : result;
    }, [product, selectedProduct]);

    return {
        productsFromVariants,
        breadcrumbCategoryId,
        errorMessage: derivedErrorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isAddToCartDisabled:
            isOutOfStock || isMissingOptions || isAddConfigurableLoading || isAddSimpleLoading || isAddProductLoading,
        isSupportedProductType,
        mediaGalleryEntries,
        shouldShowWishlistButton:
            isSignedIn && storeConfigData && !!storeConfigData.storeConfig.magento_wishlist_general_is_enabled,
        productDetails,
        customAttributes,
        wishlistButtonProps,
        wishlistItemOptions,
        deliveryData: deliveryData ? deliveryData.getProductDeliveryDate : null
    };
};
