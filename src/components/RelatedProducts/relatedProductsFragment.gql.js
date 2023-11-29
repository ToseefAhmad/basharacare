import { gql } from '@apollo/client';

export const RelatedProductsFragment = gql`
    fragment RelatedProductsFragment on ProductInterface {
        related_products {
            __typename
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            id
            uid
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
`;
