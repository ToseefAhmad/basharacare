import { gql } from '@apollo/client';

import { ItemsReviewFragment } from '@app/components/overrides/CheckoutPage/ItemsReview/itemsReviewFragments.gql.js';

export const OrderConfirmationPageFragment = gql`
    fragment OrderConfirmationPageFragment on Cart {
        id
        email
        total_quantity
        selected_payment_method {
            code
            title
        }
        shipping_addresses {
            firstname
            lastname
            street
            city
            telephone
            region {
                label
            }
            postcode
            country {
                label
            }
            selected_shipping_method {
                carrier_title
                method_title
            }
        }
        applied_coupons {
            code
        }
        ...ItemsReviewFragment
    }
    ${ItemsReviewFragment}
`;
