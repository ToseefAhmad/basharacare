import { useMutation } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { useTracking } from '@app/hooks/useTracking';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import operations from '@magento/peregrine/lib/talons/Gallery/addToCart.gql.js';
import { useToasts } from '@magento/peregrine/lib/Toasts/useToasts';

/**
 * @param {String} props.item.uid - uid of item
 * @param {String} props.item.name - name of item
 * @param {String} props.item.stock_status - stock status of item
 * @param {String} props.item.__typename - product type
 * @param {String} props.item.url_key - item url key
 * @param {String} props.item.sku - item sku
 *
 * @returns {
 *      handleAddToCart: Function,
 *      isDisabled: Boolean,
 *      isInStock: Boolean
 * }
 *
 */
const UNSUPPORTED_PRODUCT_TYPES = ['VirtualProduct', 'BundleProduct', 'GroupedProduct', 'DownloadableProduct'];

export const useAddToCartButton = props => {
    const { item, urlSuffix, algoliaQueryId } = props;

    const [isLoading, setIsLoading] = useState(false);

    const isInStock = item.stock_status === 'IN_STOCK';

    const productType = item.__typename;
    const isUnsupportedProductType = UNSUPPORTED_PRODUCT_TYPES.includes(productType);
    const isDisabled = isLoading || !isInStock || isUnsupportedProductType;

    const history = useHistory();
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const { trackAddToCart, getProductCategories } = useTracking();

    const [{ cartId }] = useCartContext();

    const [
        ,
        {
            actions: { setCartPopUp }
        }
    ] = useAppContext();

    const [addToCart] = useMutation(operations.ADD_ITEM, {
        onError: () => {
            setIsLoading(false);

            addToast({
                type: 'error',
                message: formatMessage(
                    {
                        id: 'addToCart.unknownMsg',
                        defaultMessage: `Failed to add {name} to your shopping cart. Unknown error`
                    },
                    {
                        name: item.name
                    }
                ),
                timeout: false
            });
        },
        onCompleted: data => {
            const response = data && data.addProductsToCart;
            const hasErrors = response.user_errors && response.user_errors.length > 0;

            if (hasErrors) {
                response.user_errors.map(error => {
                    addToast({
                        type: 'error',
                        message: error.message,
                        timeout: false
                    });
                });
            } else {
                // Trigger mini-cart pop-up
                setCartPopUp({ cartItem: { ...item, ...{ quantity: 1 } } });
                // Track add to cart event
                trackAddToCart({
                    products: [
                        {
                            name: item.name,
                            sku: item.sku,
                            quantity: 1,
                            price: item.price_range.maximum_price.final_price.value,
                            currency: item.price_range.maximum_price.final_price.currency,
                            category: getProductCategories(item.categories),
                            brand: item.brand_name
                        }
                    ]
                });
            }
        }
    });

    const handleAddToCart = useCallback(async () => {
        try {
            if (productType === 'SimpleProduct') {
                setIsLoading(true);

                await addToCart({
                    variables: {
                        cartId,
                        cartItem: {
                            quantity: 1,
                            algoliasearch_query_param: algoliaQueryId,
                            ...(item.uid && item.name
                                ? {
                                      entered_options: [
                                          {
                                              uid: item.uid,
                                              value: item.name
                                          }
                                      ]
                                  }
                                : {}),
                            sku: item.sku
                        }
                    }
                });

                setIsLoading(false);
            } else if (productType === 'ConfigurableProduct') {
                history.push(`${item.url_key}${urlSuffix || ''}`);
            } else {
                console.warn('Unsupported product type unable to handle.');
            }
        } catch (error) {
            console.error(error);
        }
    }, [
        productType,
        addToCart,
        cartId,
        algoliaQueryId,
        item.uid,
        item.name,
        item.sku,
        item.url_key,
        history,
        urlSuffix
    ]);

    return {
        handleAddToCart,
        isDisabled,
        isInStock
    };
};
