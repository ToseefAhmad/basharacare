import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect } from 'react';
import { useIntl } from 'react-intl';

import DEFAULT_OPERATIONS from '@app/components/FreeSamples/freeSamples.qql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useToasts } from '@magento/peregrine/lib/Toasts/useToasts';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useFreeSamples = () => {
    const operations = mergeOperations(DEFAULT_OPERATIONS);
    const { getFreeSamplesQuery, addItemToCart, getCartDetails } = operations;

    const [{ cartId }] = useCartContext();

    const [, { addToast }] = useToasts();

    const { formatMessage } = useIntl();

    const { data, refetch, loading: samplesLoading } = useQuery(getFreeSamplesQuery, {
        fetchPolicy: 'cache-and-network',
        skip: !cartId,
        variables: {
            cartId
        }
    });

    const { data: cartData } = useQuery(getCartDetails, {
        fetchPolicy: 'cache-only',
        skip: !cartId,
        variables: {
            cartId
        }
    });

    useEffect(() => {
        if (cartData && refetch !== undefined) {
            refetch();
        }
    }, [cartData, refetch]);

    const [addToCart, { loading }] = useMutation(addItemToCart);

    const handleAddToCart = useCallback(
        async ({ name, uid, sku }) => {
            try {
                await addToCart({
                    variables: {
                        cartId,
                        cartItem: {
                            quantity: 1,
                            entered_options: [
                                {
                                    uid,
                                    value: name
                                }
                            ],
                            sku: sku
                        }
                    }
                });
                await refetch();
                addToast({
                    type: 'success',
                    message: formatMessage(
                        {
                            id: 'samples.addedToCart',
                            defaultMessage: `You added {sample} sample to your shopping cart.`
                        },
                        {
                            sample: name
                        }
                    )
                });
            } catch (error) {
                console.error(error);
            }
        },
        [addToCart, cartId, addToast, formatMessage, refetch]
    );

    const items = cartData?.cart?.items ? cartData?.cart?.items.length : 0;
    const samples = data ? data.sampleProducts.sample_items : null;
    const samplesQty = samples ? samples.length : 0;
    const inCart = data ? data.sampleProducts.count_in_cart : null;
    const maxInCart = data ? data.sampleProducts.max_count_in_cart : null;
    const limitReached = inCart >= maxInCart;
    const canAdd = maxInCart - inCart <= samplesQty ? maxInCart - inCart : samplesQty;
    const isOnlySampleProductInCart = inCart > 0 && inCart === items;

    return {
        data,
        handleAddToCart,
        samples,
        inCart,
        maxInCart,
        limitReached,
        canAdd,
        loading: loading || samplesLoading,
        isOnlySampleProductInCart
    };
};
