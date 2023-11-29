import { gql } from '@apollo/client';

import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';

export const RESTORE_CART_ON_FAILED_PAYMENT = gql`
    mutation RestoreQuoteFromOrderNumber($orderNumber: String) {
        restoreQuoteFromOrder(orderNumber: $orderNumber) {
            id
        }
    }
`;

export const GET_CART_DETAILS_AFTER_RESTORE = gql`
    query GetCartDetailsAfterRestore($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            items {
                id
                product {
                    id
                    name
                    sku
                    small_image {
                        url
                        label
                    }
                    price {
                        regularPrice {
                            amount {
                                value
                            }
                        }
                    }
                }
                quantity
                ... on ConfigurableCartItem {
                    configurable_options {
                        id
                        option_label
                        value_id
                        value_label
                    }
                }
            }
            prices {
                grand_total {
                    value
                    currency
                }
            }
            ...CartPageFragment
        }
    }
    ${CartPageFragment}
`;
