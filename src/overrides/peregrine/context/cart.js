import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import { any } from 'prop-types';
import React, { createContext, useContext, useEffect, useMemo, useCallback } from 'react';
import { connect } from 'react-redux';

import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { useEventListener } from '@magento/peregrine/lib/hooks/useEventListener';
import actions from '@magento/peregrine/lib/store/actions/cart/actions';
import * as asyncActions from '@magento/peregrine/lib/store/actions/cart/asyncActions';
import bindActionCreators from '@magento/peregrine/lib/util/bindActionCreators';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

const CartContext = createContext();

const isCartEmpty = cart => !cart || !cart.details.items || cart.details.items.length === 0;

const getTotalQuantity = items => items.reduce((total, item) => total + item.quantity, 0);

const CartContextProvider = ({ actions, asyncActions, cartState, children }) => {
    // Make deeply nested details easier to retrieve and provide empty defaults
    const derivedDetails = useMemo(() => {
        if (isCartEmpty(cartState)) {
            return {
                currencyCode: 'USD',
                numItems: 0,
                subtotal: 0
            };
        } else {
            return {
                currencyCode: cartState.details.prices.grand_total.currency,
                numItems: getTotalQuantity(cartState.details.items),
                subtotal: cartState.details.prices.grand_total.value
            };
        }
    }, [cartState]);

    const cartApi = useMemo(
        () => ({
            actions,
            ...asyncActions
        }),
        [actions, asyncActions]
    );

    const contextValue = useMemo(() => {
        const derivedCartState = {
            ...cartState,
            isEmpty: isCartEmpty(cartState),
            derivedDetails
        };

        return [derivedCartState, cartApi];
    }, [cartApi, cartState, derivedDetails]);

    const [fetchCartId] = useMutation(CREATE_CART_MUTATION);
    const fetchCartDetails = useAwaitQuery(CART_DETAILS_QUERY);

    const storeCodeInUrl = useCallback(() => {
        // Get available store views for current domain
        const storeCodes = [];
        AVAILABLE_STORE_VIEWS.forEach(store => storeCodes.push(store.code));

        // Sort by length (longest first) to avoid false hits ie "en" matching just
        // The "/en" in "/en-us/home.html" when "en-us" is also in storeCodes.
        storeCodes.sort((a, b) => b.length - a.length);

        // Find the store code in the url. This will always be the first path.
        // I.e. `https://example.com/fr/foo/baz.html` => `fr`.
        const regex = new RegExp(`^/(${storeCodes.join('|')})`, 'g');
        const { location } = globalThis;
        const { pathname } = location;
        const match = location && pathname.match(regex);
        return match && match[0].replace(/\//g, '');
    }, []);

    // Storage listener to force a state update if cartId changes from another browser tab.
    const storageListener = useCallback(() => {
        const storage = new BrowserPersistence();
        const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE || 'default';
        const currentCartId = storage.getItem(storeCode + '_cartId');
        const orderNumber = storage.getItem('checkout_order_number');
        const { cartId } = cartState;
        if (cartId && currentCartId && cartId !== currentCartId && !orderNumber) {
            globalThis.location.assign(globalThis.location.href.replace('/' + storeCodeInUrl(), '/' + storeCode));
        }
    }, [cartState, storeCodeInUrl]);

    useEventListener(globalThis, 'storage', storageListener);

    useEffect(() => {
        // CartApi.getCartDetails initializes the cart if there isn't one.
        cartApi.getCartDetails({
            fetchCartId,
            fetchCartDetails
        });
    }, [cartApi, fetchCartDetails, fetchCartId]);

    return <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>;
};

CartContextProvider.propTypes = {
    actions: any,
    asyncActions: any,
    cartState: any,
    children: any
};

const mapStateToProps = ({ cart }) => ({ cartState: cart });

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(actions, dispatch),
    asyncActions: bindActionCreators(asyncActions, dispatch)
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(CartContextProvider);

export const useCartContext = () => useContext(CartContext);

/**
 * We normally do not keep GQL queries in Peregrine. All components should pass
 * queries to talons/hooks. This is an exception to the rule because it would
 * be unecessarily complex to pass these queries to the context provider.
 */
const CREATE_CART_MUTATION = gql`
    mutation createCart {
        cartId: createEmptyCart
    }
`;

const CART_DETAILS_QUERY = gql`
    query checkUserIsAuthed($cartId: String!) {
        cart(cart_id: $cartId) {
            # The purpose of this query is to check that the user is authorized
            # to query on the current cart. Just fetch "id" to keep it small.
            id
        }
    }
`;
