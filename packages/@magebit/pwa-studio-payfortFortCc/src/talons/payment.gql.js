import { gql } from '@apollo/client';
import {
    OrderConfirmationPageFragment
} from "@app/components/overrides/CheckoutPage/OrderConfirmationPage/orderConfirmationPageFragments.gql";
import {PriceSummaryFragment} from "@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql";
import {AppliedRewardCodesFragment} from "@app/components/RewardsAccount/RewardCode/rewardCodeFragments.gql";

export const GET_PAYMENT_CONFIG_DATA = gql`
    query storeConfigData {
        storeConfig {
            store_code
            payment_payfort_fort_cc_title
            payment_payfort_applepay_title
            payment_payfort_fort_cc_instructions
            applepay_debug
        }
    }
`;

export const SET_PAYMENT_APS_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: { code: "aps_fort_cc" } })
            @connection(key: "setPaymentMethodOnCart") {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: { code: "payfort_fort_cc" } })
            @connection(key: "setPaymentMethodOnCart") {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export const SET_PAYMENT_METHOD_APPLE_PAY = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(input: { cart_id: $cartId, payment_method: { code: "payfort_applepay" } })
            @connection(key: "setPaymentMethodOnCart") {
            cart {
                id
                selected_payment_method {
                    code
                    title
                }
            }
        }
    }
`;

export const APPLE_PAY_PLACE_ORDER = gql`
    mutation setApplePayPlaceOrder($cartId: String, $information: String) {
        applePayPlaceOrder(input: { cartId: $cartId, information: $information }) {
            order {
                order_number
                redirect_url
                error
            }
        }
    }
`;

export const APPLE_PAY_SET_ADDRESS_SHIPPING = gql`
    mutation applePaySetShippingAddress($cartId: String, $address: String) {
        applePaySetShippingAddress(input: { cartId: $cartId, address: $address }) {
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

export const APPLE_PAY_SET_SHIPPING = gql`
    mutation applePaySetShipping($cartId: String, $address: String) {
        applePaySetShipping(input: { cartId: $cartId, address: $address }) @connection(key: "applePaySetShipping") {
            newShippingMethods {
                identifier
                label
                detail
                amount
            }
        }
    }
`;

export const APPLE_PAY_SET_LOGGER = gql`
    mutation applePayLogger($debug: String, $status: String, $message: String) {
        applePayLogger(input: { debug: $debug, status: $status, message: $message }) {
            debug
        }
    }
`;

export default {
    getPaymentConfigQuery: GET_PAYMENT_CONFIG_DATA,
    setPaymentApsMethodOnCartMutation: SET_PAYMENT_APS_METHOD_ON_CART,
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART,
    setPaymentMethodApplePayMutation: SET_PAYMENT_METHOD_APPLE_PAY,
    applePayPlaceOrderMutation: APPLE_PAY_PLACE_ORDER,
    applePaySetShippingMutation: APPLE_PAY_SET_SHIPPING,
    applePaySetShippingAddressMutation: APPLE_PAY_SET_ADDRESS_SHIPPING,
    applePaySetLoggerMutation: APPLE_PAY_SET_LOGGER
};
