import { gql } from '@apollo/client';

import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql';

import { AppliedRewardCodesFragment } from './rewardCodeFragments.gql';

const GET_APPLIED_REWARD_CODES = gql`
    query getAppliedRewardCodes($cartId: String!) {
        cart(cart_id: $cartId) {
            id

            ...AppliedRewardCodesFragment
        }
        reward {
            amount
        }
    }
    ${AppliedRewardCodesFragment}
`;

const APPLY_REWARD_CODE_MUTATION = gql`
    mutation applyRewardCodeToCart($cartId: String!, $rewardCode: String!) {
        applyRewardCodeToCart(input: { cart_id: $cartId, reward_code: $rewardCode }) {
            cart {
                id
                ...CartPageFragment
                ...AppliedRewardCodesFragment
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
            }
        }
    }
    ${CartPageFragment}
    ${AppliedRewardCodesFragment}
`;

const REMOVE_REWARD_CODE_MUTATION = gql`
    mutation removeRewardCodeFromCart($cartId: String!) {
        removeRewardCodeFromCart(input: { cart_id: $cartId }) {
            cart {
                id
                ...CartPageFragment
                ...AppliedRewardCodesFragment
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
            }
        }
    }
    ${CartPageFragment}
    ${AppliedRewardCodesFragment}
`;

export default {
    getAppliedRewardCodesQuery: GET_APPLIED_REWARD_CODES,
    applyRewardCodeMutation: APPLY_REWARD_CODE_MUTATION,
    removeRewardCodeMutation: REMOVE_REWARD_CODE_MUTATION
};
