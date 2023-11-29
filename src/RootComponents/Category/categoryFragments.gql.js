import { gql } from '@apollo/client';

export const CategoryFragment = gql`
    # eslint-disable-next-line @graphql-eslint/require-id-when-available
    fragment CategoryFragment on CategoryTree {
        id
        uid
        name
        meta_title
        meta_keywords
        meta_description
        description
        canonical_url
        title
        url_key
        hreflang_links {
            href
            hreflang
        }
        rich_data {
            organization
            website
        }
        open_graph {
            type
            url
            image
            site_name
            title
            description
        }
    }
`;

export const ProductsFragment = gql`
    fragment ProductsFragment on Products {
        items {
            __typename
            id
            uid
            name
            brand_name
            brand_url
            categories {
                uid
                name
                breadcrumbs {
                    category_uid
                    category_name
                }
            }
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
            stock_status
            review_count
            rating_summary
            items_sold
            url_key
        }
        page_info {
            total_pages
        }
    }
`;
