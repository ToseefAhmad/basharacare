import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback, useEffect } from 'react';
import { useLocation } from 'react-router';

import { useAppContext } from '@app/context/App';
import { saveCartId } from '@app/overrides/peregrine/store/actions/cart/asyncActions';
import { clearCartDataFromCache } from '@magento/peregrine/lib/Apollo/clearCartDataFromCache';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

import { GET_CART_DETAILS_AFTER_RESTORE, RESTORE_CART_ON_FAILED_PAYMENT } from './useCartRestore.gql';

const storage = new BrowserPersistence();

const useCartRestore = () => {
    const [restoreCart] = useMutation(RESTORE_CART_ON_FAILED_PAYMENT);
    const fetchCartDetails = useAwaitQuery(GET_CART_DETAILS_AFTER_RESTORE);
    const [, { removeCart, getCartDetails, setCartIdToState }] = useCartContext();
    const [, { setIsRestoringCart }] = useAppContext();
    const apolloClient = useApolloClient();
    const { pathname } = useLocation();

    const removeStorageOrderData = () => {
        storage.removeItem('checkout_order_data');
        storage.removeItem('checkout_order_number');
        storage.removeItem('checkout_order_tracked');
    };

    const handleRestoringCart = useCallback(
        async orderNumber => {
            const result = await restoreCart({
                variables: {
                    orderNumber
                }
            });

            if (result && result.data && result.data.restoreQuoteFromOrder) {
                removeStorageOrderData();
                await removeCart();
                await clearCartDataFromCache(apolloClient);
                await saveCartId(result.data.restoreQuoteFromOrder.id);
                await setCartIdToState(result.data.restoreQuoteFromOrder.id);
                await getCartDetails({ fetchCartDetails });
            }
            setIsRestoringCart(false);
        },
        [restoreCart, removeCart, apolloClient, getCartDetails, fetchCartDetails, setIsRestoringCart, setCartIdToState]
    );

    useEffect(() => {
        try {
            const orderNumber = storage.getItem('checkout_order_number');
            const isOrderTracked = storage.getItem('checkout_order_tracked') === 'true';

            // We will only reset cart on specific pages so that other open tabs do not interfere with success page
            const resetPaths = ['/checkout', '/cart'];
            const cleanPath = pathname.replace(/\/$/, '');

            if (resetPaths.includes(cleanPath) && orderNumber) {
                if (typeof orderNumber !== 'object') {
                    // Restore Previous quote if we have not been in order success page already.
                    setIsRestoringCart(true);
                    handleRestoringCart(orderNumber);
                }

                if (isOrderTracked) {
                    removeStorageOrderData();
                }
            }
        } catch (e) {
            // Do nothing and ignore
        }
    }, [handleRestoringCart, pathname, setIsRestoringCart]);
};

export default useCartRestore;
