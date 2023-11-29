import { gql } from '@apollo/client';

export const CREATE_FAQ_QUESTION = gql`
    mutation placeAmFaqQuestion($title: String!, $name: String, $product_id: Int, $email: String) {
        placeAmFaqQuestion(input: { title: $title, name: $name, product_id: $product_id, email: $email }) {
            error
            message
        }
    }
`;

export const GET_FAQ_QUESTIONS = gql`
    query getProductQuestions($url_key: String!) {
        products(filter: { url_key: { eq: $url_key } }) {
            items {
                uid
                amfaq_questions {
                    answer
                    name
                    short_answer
                    status
                    title
                }
            }
        }
    }
`;
