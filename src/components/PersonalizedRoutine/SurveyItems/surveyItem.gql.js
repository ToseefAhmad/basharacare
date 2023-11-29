import { gql } from '@apollo/client';

export const SET_STATUS_RESPONSE = gql`
    mutation setStatusResponse($id: Int!) {
        setStatusResponse(id: $id)
    }
`;
