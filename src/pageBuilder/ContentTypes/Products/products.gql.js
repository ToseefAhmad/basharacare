import { gql } from '@apollo/client';

export const GET_PRODUCTS_BY_URL_KEY = gql`
    query getProductsByUrlKey($url_keys: [String], $pageSize: Int!) {
        products(filter: { url_key: { in: $url_keys } }, pageSize: $pageSize) {
            items {
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
                        final_price {
                            currency
                            value
                        }
                        regular_price {
                            currency
                            value
                        }
                    }
                }
                price_tiers {
                    final_price {
                        currency
                        value
                    }
                    quantity
                }
                sku
                small_image {
                    url
                }
                stock_status
                type_id
                url_key
            }

            total_count
            filters {
                name
                filter_items_count
                request_var
                filter_items {
                    label
                    value_string
                }
            }
        }
    }
`;

export const GET_STORE_CONFIG_DATA = gql`
    query getStoreConfigData {
        storeConfig {
            id
            product_url_suffix
            store_code
        }
    }
`;
