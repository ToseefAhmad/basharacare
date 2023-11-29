import { gql } from '@apollo/client';

export const GET_CUSTOMER_REVIEWS = gql`
    query getCustomerReviews($pageSize: Int!, $currentPage: Int!) {
        customer {
            reviews(pageSize: $pageSize, currentPage: $currentPage) {
                items {
                    summary
                    text
                    created_at
                    average_rating
                    ratings_breakdown {
                        name
                        value
                    }
                    product {
                        uid
                        sku
                        name
                        price {
                            regularPrice {
                                amount {
                                    currency
                                    value
                                }
                            }
                        }
                        url
                        img
                        brand_name
                        brand_url
                    }
                }
                page_info {
                    page_size
                    current_page
                    total_pages
                }
            }
        }
    }
`;
