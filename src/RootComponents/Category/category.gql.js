import { AmShopbyFilterDataFragment, AggregationOptionFragment } from '@amasty/iln/src/talons/amILNFragments.gql';
import { gql } from '@apollo/client';

import { CategoryFragment, ProductsFragment } from './categoryFragments.gql';

export const GET_CATEGORY_PAGE_SIZE = gql`
    query getCategoryPageSize {
        storeConfig {
            store_code
            grid_per_page
        }
    }
`;

export const GET_CATEGORY = gql`
    query GetCategory($id: String!, $filters: ProductAttributeFilterInput) {
        categories(filters: { category_uid: { in: [$id] } }, productsFilter: $filters) {
            items {
                uid
                ...CategoryFragment
            }
        }
    }
    ${CategoryFragment}
`;

export const GET_CATEGORY_PRODUCTS = gql`
    query GetCategoryProducts(
        $pageSize: Int!
        $currentPage: Int!
        $filters: ProductAttributeFilterInput!
        $sort: ProductAttributeSortInput
    ) {
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
            ...ProductsFragment
        }
    }
    ${ProductsFragment}
    ${AmShopbyFilterDataFragment}
    ${AggregationOptionFragment}
`;

export const GET_FILTER_INPUTS = gql`
    query GetFilterInputsForCategory {
        __type(name: "ProductAttributeFilterInput") {
            inputFields {
                name
                type {
                    name
                }
            }
        }
    }
`;

export const GET_PRODUCTS_RICH_DATA = gql`
    query GetProductsRichData($skus: [String]) {
        productsRichData(skus: $skus) {
            id
            rich_data
        }
    }
`;

export default {
    getCategoryPageSizeQuery: GET_CATEGORY_PAGE_SIZE,
    getCategoryQuery: GET_CATEGORY,
    getCategoryProductsQuery: GET_CATEGORY_PRODUCTS,
    getFilterInputsQuery: GET_FILTER_INPUTS,
    getProductsRichDataQuery: GET_PRODUCTS_RICH_DATA
};
