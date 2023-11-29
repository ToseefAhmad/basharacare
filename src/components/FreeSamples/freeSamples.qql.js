import { gql } from '@apollo/client';

import { MiniCartFragment } from '@magento/peregrine/lib/talons/MiniCart/miniCartFragments.gql.js';

const GET_FREE_SAMPLES = gql`
    query getFreeSamplesQuery($cartId: String!) {
        sampleProducts(cartId: $cartId) {
            max_count_in_cart
            count_in_cart
            sample_items {
                name
                sku
                uid
                small_image {
                    url
                }
                id
                url_key
                url_suffix
                stock_status
            }
        }
    }
`;

const GET_CART_DETAILS = gql`
    query GetCartDetails($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            items {
                id
            }
        }
    }
`;

const ADD_ITEM = gql`
    mutation AddItemToCart($cartId: String!, $cartItem: CartItemInput!) {
        addProductsToCart(cartId: $cartId, cartItems: [$cartItem]) {
            cart {
                id
                ...MiniCartFragment
            }
        }
    }
    ${MiniCartFragment}
`;

export default {
    getFreeSamplesQuery: GET_FREE_SAMPLES,
    addItemToCart: ADD_ITEM,
    getCartDetails: GET_CART_DETAILS
};
