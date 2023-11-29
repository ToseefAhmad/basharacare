import { gql } from '@apollo/client';

export const CheckoutPageFragment = gql`
    fragment CheckoutPageFragment on Cart {
        id
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        items {
            uid
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            product {
                uid
                name
                sku
                stock_status
                brand_name
                categories {
                    uid
                    name
                    breadcrumbs {
                        category_uid
                        category_name
                    }
                }
            }
            quantity
            prices {
                price {
                    value
                    currency
                }
            }
        }
        # If total quantity is falsy we render empty.
        total_quantity
        available_payment_methods {
            code
        }
    }
`;
