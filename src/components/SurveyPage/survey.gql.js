import { gql } from '@apollo/client';

export const SET_SURVEY_RESPONSE = gql`
    mutation SetResponse($id: Int!, $response: [SurveyFormInput]!) {
        setSurveyResponse(id: $id, response: $response)
    }
`;

export const GET_SURVEY = gql`
    query GetSurvey($identifier: String!) {
        survey(identifier: $identifier) {
            id
            title
            description
            backgroundImage
            successTitle
            successText
            questions {
                question_id
                title
                description
                type
                is_require
                max_answers
                has_other_field
                answers {
                    answer_id
                    title
                    description
                    image
                }
            }
        }
    }
`;
