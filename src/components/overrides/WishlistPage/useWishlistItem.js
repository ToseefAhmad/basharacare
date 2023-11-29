import { useMutation } from '@apollo/client';
import { useCallback, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import { useToasts } from '@magento/peregrine';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './wishlistItem.gql';

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct', 'ConfigurableProduct'];

const mergeSupportedProductTypes = (supportedProductTypes = []) => {
    const newSupportedProductTypes = [...SUPPORTED_PRODUCT_TYPES];

    if (supportedProductTypes) {
        newSupportedProductTypes.push(...supportedProductTypes);
    }

    return newSupportedProductTypes;
};

/**
 * @function
 *
 * @param {String} props.item Wishlist Item data from GraphQL
 * @param {WishlistItemOperations} props.operations GraphQL operations for the Wishlist Item component
 * @param {String} props.wishlistId The ID of the wishlist this item belongs to
 *
 * @returns {WishlistItemProps}
 */
export const useWishlistItem = (props, qty, comment) => {
    const { item, onOpenAddToCartDialog, wishlistId, updateItems, supportedProductTypes } = props;

    const { configurable_options: selectedConfigurableOptions = [], id: itemId, product } = item;

    const {
        configurable_options: configurableOptions = [],
        __typename: productType,
        image,
        sku,
        stock_status: stockStatus
    } = product;
    const { label: imageLabel, url: imageURL } = image;

    const isSupportedProductType = useMemo(
        () => mergeSupportedProductTypes(supportedProductTypes).includes(productType),
        [supportedProductTypes, productType]
    );

    const operations = mergeOperations(defaultOperations, props.operations);
    const {
        addWishlistItemToCartMutation,
        updateWishlistItemToCartMutation,
        removeProductsFromWishlistMutation
    } = operations;
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const [{ cartId }] = useCartContext();
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const [isRemovalInProgress, setIsRemovalInProgress] = useState(false);

    const [removeProductFromWishlistError, setRemoveProductFromWishlistError] = useState(null);

    const wishlistItem = useMemo(() => {
        const item = {
            quantity: qty,
            description: comment,
            wishlist_item_id: Number(itemId)
        };

        // Merge in additional input variables for configurable items
        if (selectedConfigurableOptions.length && selectedConfigurableOptions.length === configurableOptions.length) {
            const selectedOptionsArray = selectedConfigurableOptions.map(selectedOption => {
                const {
                    configurable_product_option_uid: attributeId,
                    configurable_product_option_value_uid: selectedValueId
                } = selectedOption;
                const configurableOption = configurableOptions.find(option => option.attribute_id_v2 === attributeId);
                const configurableOptionValue = configurableOption.values.find(
                    optionValue => optionValue.value_index === selectedValueId
                );

                return configurableOptionValue.uid;
            });

            Object.assign(item, {
                selected_options: selectedOptionsArray
            });
        }

        return item;
    }, [comment, configurableOptions, itemId, qty, selectedConfigurableOptions]);

    const [updateWishlistItemToCart] = useMutation(updateWishlistItemToCartMutation, {
        update: cache => {
            // Clean up for cache fav product on category page
            cache.modify({
                id: 'ROOT_QUERY',
                fields: {
                    customerWishlistProducts: cachedProducts => cachedProducts.filter(productSku => productSku !== sku)
                }
            });

            cache.modify({
                id: `CustomerWishlist:${wishlistId}`,
                fields: {
                    items_v2: (cachedItems, { readField, Remove }) => {
                        for (let i = 0; i < cachedItems.items.length; i++) {
                            if (readField('id', item) === itemId) {
                                return Remove;
                            }
                        }

                        return cachedItems;
                    }
                }
            });
        }
    });

    const cartItem = useMemo(() => {
        const item = {
            quantity: qty,
            sku
        };

        // Merge in additional input variables for configurable items
        if (selectedConfigurableOptions.length && selectedConfigurableOptions.length === configurableOptions.length) {
            const selectedOptionsArray = selectedConfigurableOptions.map(selectedOption => {
                const {
                    configurable_product_option_uid: attributeId,
                    configurable_product_option_value_uid: selectedValueId
                } = selectedOption;
                const configurableOption = configurableOptions.find(option => option.attribute_id_v2 === attributeId);
                const configurableOptionValue = configurableOption.values.find(
                    optionValue => optionValue.value_index === selectedValueId
                );

                return configurableOptionValue.uid;
            });

            Object.assign(item, {
                selected_options: selectedOptionsArray
            });
        }

        return item;
    }, [configurableOptions, qty, selectedConfigurableOptions, sku]);

    const [
        addWishlistItemToCart,
        { error: addWishlistItemToCartError, loading: addWishlistItemToCartLoading }
    ] = useMutation(addWishlistItemToCartMutation, {
        variables: {
            cartId,
            cartItem
        }
    });

    const [removeProductsFromWishlist] = useMutation(removeProductsFromWishlistMutation, {
        update: cache => {
            // Clean up for cache fav product on category page
            cache.modify({
                id: 'ROOT_QUERY',
                fields: {
                    customerWishlistProducts: cachedProducts => cachedProducts.filter(productSku => productSku !== sku)
                }
            });

            cache.modify({
                id: `CustomerWishlist:${wishlistId}`,
                fields: {
                    items_v2: (cachedItems, { readField, Remove }) => {
                        for (var i = 0; i < cachedItems.items.length; i++) {
                            if (readField('id', item) === itemId) {
                                return Remove;
                            }
                        }

                        return cachedItems;
                    }
                }
            });
        },
        variables: {
            wishlistId: wishlistId,
            wishlistItemsId: [itemId]
        }
    });

    const handleAddToCart = useCallback(async () => {
        if (configurableOptions.length === 0 || selectedConfigurableOptions.length === configurableOptions.length) {
            try {
                await addWishlistItemToCart();

                addToast({
                    type: 'success',
                    message: formatMessage(
                        {
                            id: 'wishlist.addToCart',
                            defaultMessage: ' {qty} {name} added to cart'
                        },
                        { name: product.name, qty: qty }
                    )
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            onOpenAddToCartDialog(item);
        }
    }, [
        addWishlistItemToCart,
        configurableOptions.length,
        item,
        onOpenAddToCartDialog,
        selectedConfigurableOptions.length,
        addToast,
        formatMessage,
        product,
        qty
    ]);

    const handleUpdateWishlistItem = useCallback(async () => {
        await updateWishlistItemToCart({
            variables: {
                wishlistId,
                wishlistItems: [wishlistItem]
            }
        });
        updateItems();
    }, [updateItems, updateWishlistItemToCart, wishlistId, wishlistItem]);

    const handleRemoveProductFromWishlist = useCallback(async () => {
        try {
            setIsRemovalInProgress(true);
            await removeProductsFromWishlist();
        } catch (e) {
            console.error(e);
            setRemoveProductFromWishlistError(e);
            if (process.env.NODE_ENV !== 'production') {
                console.error(e);
            }
        }
        setIsRemovalInProgress(false);
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'wishlistItem.removeFromWishlist',
                defaultMessage: 'Item Removed From Wishlist'
            }),
            timeout: 5000
        });
        updateItems();
    }, [addToast, formatMessage, removeProductsFromWishlist, updateItems]);

    const isInStock = stockStatus !== 'OUT_OF_STOCK';
    const addToCartButtonProps = useMemo(() => {
        return {
            disabled: addWishlistItemToCartLoading || !isInStock,
            onClick: handleAddToCart
        };
    }, [addWishlistItemToCartLoading, handleAddToCart, isInStock]);

    const imageProps = useMemo(() => {
        return {
            alt: imageLabel,
            src: imageURL,
            width: 400
        };
    }, [imageLabel, imageURL]);

    return {
        addToCartButtonProps,
        isRemovalInProgress,
        handleAddToCart,
        handleRemoveProductFromWishlist,
        hasError: !!addWishlistItemToCartError,
        hasRemoveProductFromWishlistError: !!removeProductFromWishlistError,
        handleUpdateWishlistItem,
        imageProps,
        isSupportedProductType,
        isInStock,
        setFormApi
    };
};

/**
 * JSDoc type definitions
 */

/**
 * GraphQL operations for the Wishlist Item component
 *
 * @typedef {Object} WishlistItemOperations
 *
 * @property {GraphQLDocument} addWishlistItemToCartMutation Mutation to add item to the cart
 * @property {GraphQLDocument} removeProductsFromWishlistMutation Mutation to remove a product from a wishlist
 *
 * @see [`wishlistItem.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/WishlistPage/wishlistItem.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering the Wishlist Item component
 *
 * @typedef {Object} WishlistItemProps
 *
 * @property {Function} handleRemoveProductFromWishlist Callback to actually remove product from wishlist
 * @property {Boolean} hasError Boolean which represents if there was an error adding the wishlist item to cart
 * @property {Boolean} hasRemoveProductFromWishlistError If there was an error removing a product from the wishlist
 * @property {Boolean} isRemovalInProgress Whether the remove product from wishlist operation is in progress
 * @property {Boolean} isSupportedProductType is this product type suported
 * @property {Boolean} isInStock is product in stock
 */
