import { gql } from '@apollo/client';

import { OrderConfirmationPageFragment } from '@app/components/overrides/CheckoutPage/OrderConfirmationPage/orderConfirmationPageFragments.gql.js';
import { AppliedRewardCodesFragment } from '@app/components/RewardsAccount/RewardCode/rewardCodeFragments.gql';
import { PriceSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql';

import { CheckoutPageFragment } from './checkoutPageFragments.gql';

export const IS_DELIVERY_DATE_ACTIVE = gql`
    query IsDeliveryDateActive {
        storeConfig {
            store_code
            delivery_date_active
        }
    }
`;

export const CREATE_CART = gql`
    # This mutation will return a masked cart id. If a bearer token is provided for
    # a logged in user it will return the cart id for that user.
    mutation createCart {
        cartId: createEmptyCart
    }
`;

export const PLACE_ORDER = gql`
    mutation placeOrder($cartId: String!) {
        placeOrder(input: { cart_id: $cartId }) {
            order {
                order_number
                redirect_url
                payfort {
                    order_id
                    url
                    params {
                        form_key
                        merchant_identifier
                        merchant_reference
                        access_code
                        language
                        service_command
                        return_url
                        signature
                    }
                }
            }
        }
    }
`;

// A query to fetch order details _right_ before we submit, so that we can pass
// Data to the order confirmation page.
export const GET_ORDER_DETAILS = gql`
    query getOrderDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...OrderConfirmationPageFragment
            ...PriceSummaryFragment
            ...AppliedRewardCodesFragment
        }
    }
    ${OrderConfirmationPageFragment}
    ${PriceSummaryFragment}
    ${AppliedRewardCodesFragment}
`;

export const GET_CHECKOUT_DETAILS = gql`
    query getCheckoutDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CheckoutPageFragment
        }
    }
    ${CheckoutPageFragment}
`;

export const GET_CUSTOMER = gql`
    query GetCustomerForCheckout {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            default_shipping
            firstname
        }
    }
`;

export const GET_DELIVERY_DETAILS = gql`
    query getCartDeliveryInfo($cartId: String!) {
        getCartDeliveryInfo(cartId: $cartId) {
            delivery_date
            delivery_time
            delivery_comment
        }
    }
`;

export default {
    createCartMutation: CREATE_CART,
    getCheckoutDetailsQuery: GET_CHECKOUT_DETAILS,
    getCustomerQuery: GET_CUSTOMER,
    getOrderDetailsQuery: GET_ORDER_DETAILS,
    placeOrderMutation: PLACE_ORDER,
    getDeliveryDetailsQuery: GET_DELIVERY_DETAILS
};
