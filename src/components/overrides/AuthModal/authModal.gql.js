import { gql } from '@apollo/client';

export const SIGN_OUT = gql`
    mutation SignOutFromModal {
        revokeCustomerToken(token: $token) {
            result
        }
    }
`;

export default {
    signOutMutation: SIGN_OUT
};
