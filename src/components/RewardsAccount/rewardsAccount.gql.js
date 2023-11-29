import { gql } from '@apollo/client';

export const GET_REWARDS_ACCOUNT_DATA = gql`
    query getRewardsAccountData {
        reward {
            amount
            history {
                amount
                code
                comment
                created_at
            }
        }
    }
`;

export const SUBMIT_REWARDS_FORM = gql`
    mutation SubmitRewardsForm($name: String!, $email: String!, $message: String!) {
        rewardForm(input: { name: $name, email: $email, message: $message }) {
            status
        }
    }
`;

export const GET_REFERRALS_HISTORY_DATA = gql`
    query getCustomerMyReferrals {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            referrals_items {
                email
                name
                status_name
                points_amount
            }
        }
    }
`;

export default {
    rewardsMutation: SUBMIT_REWARDS_FORM,
    getRewardsQuery: GET_REWARDS_ACCOUNT_DATA,
    getCustomerMyReferrals: GET_REFERRALS_HISTORY_DATA
};
