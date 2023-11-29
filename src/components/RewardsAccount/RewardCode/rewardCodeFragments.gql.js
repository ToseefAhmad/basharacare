import { gql } from '@apollo/client';

export const AppliedRewardCodesFragment = gql`
    fragment AppliedRewardCodesFragment on Cart {
        id
        applied_rewards {
            spend
            spend_max_points
            earn_points
        }
    }
`;
