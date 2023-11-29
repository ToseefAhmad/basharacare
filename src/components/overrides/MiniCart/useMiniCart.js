import { useQuery, useMutation } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useHistory } from 'react-router-dom';

import { useTracking } from '@app/hooks/useTracking';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './miniCart.gql';

/**
 *
 * @param {Function} props.setIsOpen - Function to toggle the mini cart
 * @param {DocumentNode} props.operations.miniCartQuery - Query to fetch mini cart data
 * @param {DocumentNode} props.operations.removeItemMutation - Mutation to remove an item from cart
 *
 * @returns {
 *      closeMiniCart: Function,
 *      errorMessage: String,
 *      handleEditCart: Function,
 *      handleProceedToCheckout: Function,
 *      handleRemoveItem: Function,
 *      loading: Boolean,
 *      productList: Array<>,
 *      subTotal: Number,
 *      totalQuantity: Number
 *      configurableThumbnailSource: String
 *  }
 */
export const useMiniCart = props => {
    const { setIsOpen } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { removeItemMutation, updateItemQuantityMutation, miniCartQuery, getStoreConfigQuery } = operations;

    const [{ cartId }] = useCartContext();
    const history = useHistory();
    const { getProductCategories, trackRemoveFromCart, trackProductClick } = useTracking();

    const { data: miniCartData, loading: miniCartLoading } = useQuery(miniCartQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: { cartId },
        skip: !cartId
    });

    const { data: storeConfigData } = useQuery(getStoreConfigQuery, {
        fetchPolicy: 'cache-only'
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

    const [removeItem, { loading: removeItemLoading, called: removeItemCalled, error: removeItemError }] = useMutation(
        removeItemMutation
    );

    const totalQuantity = useMemo(() => {
        return miniCartData?.cart?.total_quantity;
    }, [miniCartData]);

    const subTotal = useMemo(() => {
        return miniCartData?.cart?.prices?.subtotal_excluding_tax;
    }, [miniCartData]);

    const productList = useMemo(() => {
        return miniCartData?.cart?.items;
    }, [miniCartData]);

    const closeMiniCart = useCallback(() => {
        setIsOpen(false);
    }, [setIsOpen]);

    const handleProductClick = useCallback(
        product => {
            trackProductClick({
                list: 'Mini Cart',
                product: {
                    sku: product.sku,
                    name: product.name,
                    price: product.price_range.maximum_price.final_price.value,
                    currency: product.price_range.maximum_price.final_price.currency,
                    category: getProductCategories(product.categories),
                    brand: product.brand_name
                }
            });
            closeMiniCart();
        },
        [closeMiniCart, getProductCategories, trackProductClick]
    );

    const handleRemoveItem = useCallback(
        async (id, product, quantity) => {
            try {
                await removeItem({
                    variables: {
                        cartId,
                        itemId: id
                    }
                });
                trackRemoveFromCart({
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
            } catch {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [cartId, getProductCategories, removeItem, trackRemoveFromCart]
    );

    const [
        updateItemQuantity,
        { loading: updateItemQuantityLoading, called: updateItemQuantityCalled, error: updateItemQuantityError }
    ] = useMutation(updateItemQuantityMutation);

    const handleUpdateItemQuantity = useCallback(
        async (quantity, id) => {
            try {
                await updateItemQuantity({
                    variables: {
                        cartId,
                        itemId: id,
                        quantity
                    }
                });
            } catch {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [cartId, updateItemQuantity]
    );

    const handleProceedToCheckout = useCallback(() => {
        setIsOpen(false);
        history.push('/cart');
    }, [history, setIsOpen]);

    const handleEditCart = useCallback(() => {
        setIsOpen(false);
        history.push('/cart');
    }, [history, setIsOpen]);

    const derivedErrorMessage = useMemo(() => deriveErrorMessage([removeItemError, updateItemQuantityError]), [
        removeItemError,
        updateItemQuantityError
    ]);

    return {
        errorMessage: derivedErrorMessage,
        handleEditCart,
        handleProceedToCheckout,
        handleRemoveItem,
        handleUpdateItemQuantity,
        handleProductClick,
        loading:
            miniCartLoading ||
            (removeItemCalled && removeItemLoading) ||
            updateItemQuantityLoading ||
            (updateItemQuantityCalled && updateItemQuantityLoading),
        productList,
        subTotal,
        totalQuantity,
        configurableThumbnailSource,
        storeUrlSuffix
    };
};
