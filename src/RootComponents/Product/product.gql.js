import { gql } from '@apollo/client';

import { RelatedProductsFragment } from '@app/components/RelatedProducts/relatedProductsFragment.gql';

import { ProductDetailsFragment } from './productDetailFragment.gql';
import { ProductReviewFragment } from './productReviewFragment.gql';

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            product_url_suffix
        }
    }
`;

export const GET_PRODUCT_DETAIL_QUERY = gql`
    query getProductDetailForProductPage($urlKey: String!) {
        products(filter: { url_key: { eq: $urlKey } }) {
            items {
                id
                uid
                ...ProductDetailsFragment
                ...RelatedProductsFragment
                ...ProductReviewFragment
            }
        }
    }
    ${ProductReviewFragment}
    ${ProductDetailsFragment}
    ${RelatedProductsFragment}
`;

export const GET_PRODUCT_TABS_QUERY = gql`
    query getProductTabs($uid: String!) {
        getProductTabs(uid: $uid) {
            id
            title
            content
        }
    }
`;

export const GET_VIEWED_PRODUCTS_QUERY = gql`
    query getViewedProducts($skuArray: [String!]) {
        products(filter: { sku: { in: $skuArray } }) {
            items {
                id
                uid
                __typename
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                media_gallery_entries {
                    uid
                    label
                    position
                    disabled
                    file
                }
                meta_description
                name
                brand_name
                brand_url
                price_range {
                    maximum_price {
                        regular_price {
                            currency
                            value
                        }
                        final_price {
                            currency
                            value
                        }
                    }
                }
                sku
                small_image {
                    url
                }
                rating_summary
                review_count
                url_key
            }
        }
    }
`;

export default {
    getViewedProductsQuery: GET_VIEWED_PRODUCTS_QUERY,
    getProductTabsQuery: GET_PRODUCT_TABS_QUERY,
    getStoreConfigData: GET_STORE_CONFIG_DATA,
    getProductDetailQuery: GET_PRODUCT_DETAIL_QUERY
};
