import { gql } from '@apollo/client';

export const ProductReviewFragment = gql`
    fragment ProductReviewFragment on ProductInterface {
        id
        uid
        rating_summary
        review_count
        brand
    }
`;
