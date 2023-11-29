import { gql } from '@apollo/client';

export const SIGN_OUT = gql`
    mutation SignOutFromMenu($token: String) {
        revokeCustomerToken(token: $token) {
            result
        }
    }
`;

export default {
    signOutMutation: SIGN_OUT
};
