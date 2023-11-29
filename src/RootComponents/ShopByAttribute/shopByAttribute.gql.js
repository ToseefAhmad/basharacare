import { gql } from '@apollo/client';

export const GET_SHOP_BY_ATTRIBUTE_DATA = gql`
    query getShopByAttributeData($identifier: String!) {
        shopByAttribute(identifier: $identifier) {
            items {
                option_id
                value
                label
                description
                url_alias
                meta_title
                meta_keywords
                meta_description
            }
            canonical_url
            rich_data {
                breadcrumbs
                category
                organization
                website
            }
        }
    }
`;

export default {
    getShopByAttributeDataQuery: GET_SHOP_BY_ATTRIBUTE_DATA
};
