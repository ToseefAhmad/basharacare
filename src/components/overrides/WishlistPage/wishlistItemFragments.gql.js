import { gql } from '@apollo/client';

export const WishlistItemFragment = gql`
    fragment WishlistItemFragment on WishlistItemInterface {
        id
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        product {
            uid
            image {
                label
                url
            }
            name
            brand_name
            brand_url
            url
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
            is_sample
            stock_status
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on ConfigurableProduct {
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                configurable_options {
                    uid
                    attribute_code
                    attribute_id
                    attribute_id_v2
                    label
                    values {
                        uid
                        default_label
                        label
                        store_label
                        use_default_value
                        value_index
                        swatch_data {
                            ... on ImageSwatchData {
                                thumbnail
                            }
                            value
                        }
                    }
                }
            }
        }
        ... on ConfigurableWishlistItem {
            configurable_options {
                id
                option_label
                value_id
                value_label
            }
        }
    }
`;
