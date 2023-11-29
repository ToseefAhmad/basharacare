import { gql } from '@apollo/client';

export const GET_REVIEWS_AND_RATINGS = gql`
    query getProductReviews($sku: String!, $pageSize: Int!, $currentPage: Int!) {
        products(filter: { sku: { eq: $sku } }) {
            items {
                uid
                reviews(pageSize: $pageSize, currentPage: $currentPage) {
                    items {
                        average_rating
                        summary
                        text
                        created_at
                        nickname
                    }
                    page_info {
                        current_page
                        page_size
                        total_pages
                    }
                }
            }
        }
    }
`;

export const GET_REVIEWS_RATING_METADATA = gql`
    query createProductReview {
        productReviewRatingsMetadata {
            items {
                id
                name
                values {
                    value_id
                    value
                }
            }
        }
    }
`;

export const CREATE_PRODUCT_REVIEW = gql`
    mutation createProductReview(
        $sku: String!
        $nickname: String!
        $summary: String!
        $text: String!
        $rating_id: String!
        $rating_value_id: String!
    ) {
        createProductReview(
            input: {
                sku: $sku
                nickname: $nickname
                summary: $summary
                text: $text
                ratings: { id: $rating_id, value_id: $rating_value_id }
            }
        ) {
            review {
                nickname
                summary
                text
                average_rating
                ratings_breakdown {
                    name
                    value
                }
            }
        }
    }
`;
