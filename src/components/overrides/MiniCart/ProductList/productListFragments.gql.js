import { gql } from '@apollo/client';

export const ProductListFragment = gql`
    fragment ProductListFragment on Cart {
        id
        items {
            id
            uid
            product {
                id
                uid
                sku
                name
                url_key
                brand_name
                thumbnail {
                    url
                }
                categories {
                    uid
                    name
                    breadcrumbs {
                        category_uid
                        category_name
                    }
                }
                is_sample
                stock_status
                ... on ConfigurableProduct {
                    variants {
                        attributes {
                            uid
                        }
                        product {
                            id
                            uid
                            thumbnail {
                                url
                            }
                        }
                    }
                }
                price_range {
                    maximum_price {
                        final_price {
                            value
                            currency
                        }
                        regular_price {
                            value
                            currency
                        }
                    }
                }
            }
            prices {
                price {
                    currency
                    value
                }
                row_total_including_tax {
                    value
                    currency
                }
            }
            quantity
            ... on ConfigurableCartItem {
                configurable_options {
                    id
                    option_label
                    value_id
                    value_label
                }
            }
        }
    }
`;
