import { gql } from '@apollo/client';

export const ProductDetailsFragment = gql`
    fragment ProductDetailsFragment on ProductInterface {
        __typename
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        categories {
            uid
            name
            level
            breadcrumbs {
                category_uid
                category_name
            }
        }
        description {
            html
        }
        amfaq_questions {
            answer
            name
            short_answer
            status
            title
        }
        brand_name
        brand_url
        is_sample
        short_description {
            html
        }
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
        meta_title
        meta_keyword
        meta_description
        canonical_url
        hreflang_links {
            href
            hreflang
        }
        rich_data {
            product
            breadcrumbs
            category
            organization
            website
            faq
        }
        open_graph {
            type
            url
            image
            site_name
            title
            description
        }
        name
        price_range {
            maximum_price {
                regular_price {
                    value
                    currency
                }
                final_price {
                    value
                    currency
                }
            }
        }
        price {
            regularPrice {
                amount {
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
        url_key
        custom_attributes {
            selected_attribute_options {
                attribute_option {
                    uid
                    label
                    is_default
                }
            }
            entered_attribute_value {
                value
            }
            attribute_metadata {
                uid
                code
                label
                attribute_labels {
                    store_code
                    label
                }
                data_type
                is_system
                entity_type
                ui_input {
                    ui_input_type
                    is_html_allowed
                }
                ... on ProductAttributeMetadata {
                    used_in_components
                }
            }
        }
        ... on ConfigurableProduct {
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            configurable_options {
                attribute_code
                attribute_id
                uid
                label
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
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
            variants {
                attributes {
                    code
                    value_index
                }
                # eslint-disable-next-line @graphql-eslint/require-id-when-available
                product {
                    uid
                    # eslint-disable-next-line @graphql-eslint/require-id-when-available
                    media_gallery_entries {
                        uid
                        disabled
                        file
                        label
                        position
                    }
                    sku
                    stock_status
                    price {
                        regularPrice {
                            amount {
                                currency
                                value
                            }
                        }
                    }
                    custom_attributes {
                        selected_attribute_options {
                            attribute_option {
                                uid
                                label
                                is_default
                            }
                        }
                        entered_attribute_value {
                            value
                        }
                        attribute_metadata {
                            uid
                            code
                            label
                            attribute_labels {
                                store_code
                                label
                            }
                            data_type
                            is_system
                            entity_type
                            ui_input {
                                ui_input_type
                                is_html_allowed
                            }
                            ... on ProductAttributeMetadata {
                                used_in_components
                            }
                        }
                    }
                }
            }
        }
    }
`;
