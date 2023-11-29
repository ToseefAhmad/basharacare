import { gql } from '@apollo/client';

export const GET_PAYMENT_CONFIG_DATA = gql`
    query storeConfigData {
        storeConfig {
            store_code
            payment_cashondelivery_title
            payment_cashondelivery_instructions
        }
    }
`;

export const SET_PAYMENT_METHOD_ON_CART = gql`
    mutation setPaymentMethodOnCart($cartId: String!) {
        setPaymentMethodOnCart(
            input: { cart_id: $cartId, payment_method: { code: "cashondelivery" } }
        ) @connection(key: "setPaymentMethodOnCart") {
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

export default {
    getPaymentConfigQuery: GET_PAYMENT_CONFIG_DATA,
    setPaymentMethodOnCartMutation: SET_PAYMENT_METHOD_ON_CART
};
