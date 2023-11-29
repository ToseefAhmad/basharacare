import { gql } from '@apollo/client';

export const ALGOLIA_CONVERSION = gql`
    mutation AlgoliaSuccessPageConversion($input: SuccessPageConversion) {
        successPageConversion(input: $input)
    }
`;

export default {
    algoliaConversion: ALGOLIA_CONVERSION
};
