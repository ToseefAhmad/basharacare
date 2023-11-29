import { gql } from '@apollo/client';

import { PriceSummaryFragment } from '../overrides/CartPage/PriceSummary/priceSummaryFragments.gql';

export const APPLY_STORE_CREDIT_TO_CART = gql`
    mutation ApplyStoreCreditToCart($cartId: String!, $amount: Float) {
        applyCreditToCart(input: { cart_id: $cartId, amount: $amount }) {
            cart {
                id
                ...PriceSummaryFragment
            }
        }
    }
    ${PriceSummaryFragment}
`;

export const GET_CUSTOMER_STORE_CREDIT = gql`
    query GetCustomerStoreCredit {
        customer {
            credit {
                balance {
                    amount {
                        value
                        currency
                    }
                    currency_code
                }
            }
        }
    }
`;
