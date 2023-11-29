import { gql } from '@apollo/client';

export const GET_TABBY_CONFIG = gql`
    query GetTabbyConfig {
        storeConfig {
            store_code
            tabby_public_key
            tabby_installments_enabled
        }
    }
`;
