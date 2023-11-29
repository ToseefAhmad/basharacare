import { gql } from '@apollo/client';

export const GET_ADD_THIS_PUB_ID = gql`
    query GetAddThisPubId {
        storeConfig {
            store_code
            addthis_pubid
        }
    }
`;

export default {
    getAddThisPubId: GET_ADD_THIS_PUB_ID
};
