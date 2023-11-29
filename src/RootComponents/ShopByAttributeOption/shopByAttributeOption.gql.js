import { AggregationOptionFragment, AmShopbyFilterDataFragment } from '@amasty/iln/src/talons/amILNFragments.gql';
import { gql } from '@apollo/client';

import { ProductsFragment } from '../Category/categoryFragments.gql';

import { GET_FILTER_INPUTS } from '@magento/peregrine/lib/talons/SearchPage/searchPage.gql';

export const GET_SHOP_BY_ATTRIBUTE_SETTING = gql`
    query getShopByAttributeOptionSetting($optionId: String!) {
        shopByAttributeOption(optionId: $optionId) {
            hreflang_links {
                hreflang
                href
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

export const GET_SHOP_BY_ATTRIBUTE_DATA = gql`
    query getShopByAttributeOptionData(
        $optionId: String!
        $pageSize: Int!
        $currentPage: Int!
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
        shopByAttributeOption(optionId: $optionId, productsFilter: $filters) {
            hreflang_links {
                hreflang
                href
            }
            canonical_url
            option_id
            option_setting_id
            url_alias
            image
            value
            filter_code
            is_featured
            top_cms_block_id
            top_cms_block_identifier
            bottom_cms_block_id
            bottom_cms_block_identifier
            title
            label
            description
            meta_title
            meta_keywords
            meta_description
        }
        products(pageSize: $pageSize, currentPage: $currentPage, filter: $filters, sort: $sort) {
            aggregations {
                label
                count
                ...AmShopbyFilterDataFragment
                attribute_code
                options {
                    ...AggregationOptionFragment
                    label
                    value
                    count
                }
                position
            }
            sort_fields {
                options {
                    label
                    value
                }
            }
            ...ProductsFragment
        }
    }
    ${AmShopbyFilterDataFragment}
    ${AggregationOptionFragment}
    ${ProductsFragment}
`;

export default {
    getShopByAttributeOptionSettingQuery: GET_SHOP_BY_ATTRIBUTE_SETTING,
    getShopByAttributeOptionDataQuery: GET_SHOP_BY_ATTRIBUTE_DATA,
    getFilterInputsQuery: GET_FILTER_INPUTS
};
