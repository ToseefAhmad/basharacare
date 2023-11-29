import { gql } from '@apollo/client';

export const CUSTOMER_DATA_FRAGMENT = gql`
    fragment CustomerDataFragment on Customer {
        id
        email
        firstname
        lastname
        is_subscribed
        group_id
        wishlist_count
    }
`;
