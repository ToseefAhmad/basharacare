import { gql } from '@apollo/client';

export const GET_DEFAULT_COUNTRY = gql`
    query GetDefaultCountry {
        storeConfig {
            store_code
            default_country
        }
    }
`;
