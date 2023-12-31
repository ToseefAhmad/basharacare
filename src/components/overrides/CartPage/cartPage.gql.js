import { gql } from '@apollo/client';

import { CartPageFragment } from '@app/components/overrides/CartPage/cartPageFragments.gql';

const GET_CART_DETAILS = gql`
    query GetCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...CartPageFragment
        }
    }
    ${CartPageFragment}
`;

export default {
    getCartDetailsQuery: GET_CART_DETAILS
};
