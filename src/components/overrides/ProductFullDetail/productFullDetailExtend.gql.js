import { gql } from '@apollo/client';

export const GET_WISHLIST_CONFIG = gql`
    query GetWishlistConfigForProductCE {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            magento_wishlist_general_is_enabled
        }
    }
`;

export const GET_PRODUCT_TABS = gql`
    query GetProductTabs($uID: String!) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        getProductTabs(filter: { uid: { eq: $uID } }) {
            id
            title
            content
        }
    }
`;

export const GET_PRODUCT_DELIVERY_INFO = gql`
    query getProductDeliveryDate($uid: String!) {
        getProductDeliveryDate(uid: $uid) {
            is_visible
            delivery_time
            error_message
        }
    }
`;

export default {
    getWishlistConfigQuery: GET_WISHLIST_CONFIG,
    getProductTabs: GET_PRODUCT_TABS,
    getProductDeliveryDate: GET_PRODUCT_DELIVERY_INFO
};
