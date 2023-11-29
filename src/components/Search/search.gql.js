import { gql } from '@apollo/client';

const GET_ALGOLIA_CONFIG = gql`
    query GetAlgoliaConfig {
        getAlgoliaConfig {
            facets {
                attribute
                label
            }
            sorting {
                value
                label
            }
            numberOfProducts
        }
    }
`;

export default {
    getAlgoliaConfig: GET_ALGOLIA_CONFIG
};
