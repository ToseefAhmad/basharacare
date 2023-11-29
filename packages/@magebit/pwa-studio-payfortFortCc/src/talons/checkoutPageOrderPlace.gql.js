import { gql } from '@apollo/client';

export const PLACE_ORDER = gql`
    mutation placeOrder($cartId: String!) {
        placeOrder(input: { cart_id: $cartId }) {
            order {
                order_number
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

export const RESTORE_QUOTE = gql`
    mutation restoreQuote($cartId: String!) {
        restoreQuote(input: { cart_id: $cartId })
    }
`;

export default {
    placePayFortOrderMutation: PLACE_ORDER,
    restoreQuoteMutation: RESTORE_QUOTE
};
