import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { useTracking } from '@app/hooks/useTracking';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CartPage/ProductListing/product.gql.js';
import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage.js';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 * This talon contains logic for a product component used in a product listing component.
 * It performs effects and returns prop data for that component.
 *
 * This talon performs the following effects:
 *
 * - Manage the updating state of the cart while a product is being updated or removed
 *
 * @function
 *
 * @param {Object} props
 * @param {ProductItem} props.item Product item data
 * @param {ProductMutations} props.operations GraphQL mutations for a product in a cart
 * @param {function} props.setActiveEditItem Function for setting the actively editing item
 * @param {function} props.setIsCartUpdating Function for setting the updating state of the cart
 *
 * @return {ProductTalonProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useProduct } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProduct';
 */

export const useProduct = props => {
    const { item, setActiveEditItem, setIsCartUpdating, wishlistConfig } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { removeItemMutation, updateItemQuantityMutation, getStoreConfigQuery } = operations;

    const { formatMessage } = useIntl();
    const { getProductCategories, trackRemoveFromCart, trackProductClick } = useTracking();

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const configurableThumbnailSource = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.configurable_thumbnail_source;
        }
    }, [storeConfigData]);

    const storeUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.product_url_suffix;
        }
    }, [storeConfigData]);

    const flatProduct = flattenProduct(item, configurableThumbnailSource, storeUrlSuffix);

    const [
        removeItemFromCart,
        { called: removeItemCalled, error: removeItemError, loading: removeItemLoading }
    ] = useMutation(removeItemMutation);

    const [
        updateItemQuantity,
        { loading: updateItemLoading, error: updateError, called: updateItemCalled }
    ] = useMutation(updateItemQuantityMutation);

    const [{ cartId }] = useCartContext();

    const price = useMemo(() => item.prices.row_total_including_tax.value / item.quantity, [
        item.prices.row_total_including_tax.value,
        item.quantity
    ]);

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    const isProductUpdating = useMemo(() => {
        if (updateItemCalled || removeItemCalled) {
            return removeItemLoading || updateItemLoading;
        } else {
            return false;
        }
    }, [updateItemCalled, removeItemCalled, removeItemLoading, updateItemLoading]);

    useEffect(() => {
        if (item.errors) {
            setDisplayError(true);
        }
    }, [item.errors]);

    const derivedErrorMessage = useMemo(() => {
        return (
            (displayError && deriveErrorMessage([updateError, removeItemError])) ||
            deriveErrorMessage([...(item.errors || [])]) ||
            ''
        );
    }, [displayError, removeItemError, updateError, item.errors]);

    const handleEditItem = useCallback(() => {
        setActiveEditItem(item);

        // If there were errors from removing/updating the product, hide them
        setDisplayError(false);
    }, [item, setActiveEditItem]);

    const handleProductClick = useCallback(() => {
        trackProductClick({
            list: 'Cart Page',
            product: {
                name: item.product.name,
                sku: item.product.sku,
                price,
                currency: item.prices.row_total_including_tax.currency,
                category: getProductCategories(item.product.categories),
                brand: item.product.brand_name
            }
        });
    }, [
        getProductCategories,
        item.prices.row_total_including_tax.currency,
        item.product.brand_name,
        item.product.categories,
        item.product.name,
        item.product.sku,
        price,
        trackProductClick
    ]);

    const handleRemoveFromCart = useCallback(async () => {
        try {
            const price = item.prices.row_total_including_tax.value / item.quantity;

            await removeItemFromCart({
                variables: {
                    cartId,
                    itemId: item.uid
                }
            });
            trackRemoveFromCart({
                products: [
                    {
                        name: item.product.name,
                        sku: item.product.sku,
                        quantity: item.quantity,
                        price,
                        currency: item.prices.row_total_including_tax.currency,
                        category: getProductCategories(item.product.categories),
                        brand: item.product.brand_name
                    }
                ]
            });
        } catch (err) {
            // Make sure any errors from the mutation are displayed.
            setDisplayError(true);
        }
    }, [cartId, getProductCategories, item, removeItemFromCart, trackRemoveFromCart]);

    const handleUpdateItemQuantity = useCallback(
        async quantity => {
            try {
                await updateItemQuantity({
                    variables: {
                        cartId,
                        itemId: item.uid,
                        quantity
                    }
                });
            } catch (err) {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);
            }
        },
        [cartId, item.uid, updateItemQuantity]
    );

    useEffect(() => {
        setIsCartUpdating(isProductUpdating);

        // Reset updating state on unmount
        return () => setIsCartUpdating(false);
    }, [setIsCartUpdating, isProductUpdating]);

    const addToWishlistProps = {
        afterAdd: handleRemoveFromCart,
        buttonText: () =>
            formatMessage({
                id: 'product.moveToWishlist',
                defaultMessage: 'Move to wishlist'
            }),
        item: {
            quantity: item.quantity,
            selected_options: item.configurable_options
                ? item.configurable_options.map(option => option.configurable_product_option_value_uid)
                : [],
            sku: item.product.sku
        },
        storeConfig: wishlistConfig
    };

    return {
        addToWishlistProps,
        errorMessage: derivedErrorMessage,
        handleEditItem,
        handleRemoveFromCart,
        handleUpdateItemQuantity,
        handleProductClick,
        isEditable: !!flatProduct.options.length,
        product: flatProduct,
        isProductUpdating
    };
};

const flattenProduct = (item, configurableThumbnailSource, storeUrlSuffix) => {
    const { configurable_options: options = [], prices, product, quantity } = item;

    const configured_variant = configuredVariant(options, product);

    const { row_total_including_tax } = prices;
    const { value: rowTotal, currency } = row_total_including_tax;

    const { name, small_image, stock_status: stockStatus, url_key: urlKey } = product;
    const { url: image } =
        configurableThumbnailSource === 'itself' && configured_variant ? configured_variant.small_image : small_image;

    return {
        currency,
        image,
        name,
        options,
        quantity,
        stockStatus,
        unitPrice: rowTotal / quantity,
        urlKey,
        urlSuffix: storeUrlSuffix
    };
};

/** JSDocs type definitions */

/**
 * GraphQL mutations for a product in a cart.
 * This is a type used by the {@link useProduct} talon.
 *
 * @typedef {Object} ProductMutations
 *
 * @property {GraphQLDocument} removeItemMutation Mutation for removing an item in a cart
 * @property {GraphQLDocument} updateItemQuantityMutation Mutation for updating the item quantity in a cart
 *
 * @see [product.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/ProductListing/product.js}
 * to see the mutations used in Venia
 */

/**
 * Object type returned by the {@link useProduct} talon.
 * It provides prop data for rendering a product component on a cart page.
 *
 * @typedef {Object} ProductTalonProps
 *
 * @property {String} errorMessage Error message from an operation perfored on a cart product.
 * @property {function} handleEditItem Function to use for handling when a product is modified.
 * @property {function} handleRemoveFromCart Function to use for handling the removal of a cart product.
 * @property {function} handleUpdateItemQuantity Function to use for handling updates to the product quantity in a cart.
 * @property {boolean} isEditable True if a cart product is editable. False otherwise.
 * @property {ProductItem} product Cart product data
 */

/**
 * Data about a product item in the cart.
 * This type is used in the {@link ProductTalonProps} type returned by the {@link useProduct} talon.
 *
 * @typedef {Object} ProductItem
 *
 * @property {String} currency The currency associated with the cart product
 * @property {String} image The url for the cart product image
 * @property {String} name The name of the product
 * @property {Array<Object>} options A list of configurable option objects
 * @property {number} quantity The quantity associated with the cart product
 * @property {number} unitPrice The product's unit price
 * @property {String} urlKey The product's url key
 * @property {String} urlSuffix The product's url suffix
 */
