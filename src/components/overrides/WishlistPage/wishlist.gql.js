import { gql } from '@apollo/client';

import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql';
import { MiniCartFragment } from '@magento/peregrine/lib/talons/MiniCart/miniCartFragments.gql';
import { WishlistPageFragment } from '@magento/peregrine/lib/talons/WishlistPage/wishlistFragment.gql';

import { WishlistItemFragment } from './wishlistItemFragments.gql';

export const GET_CUSTOMER_WISHLIST = gql`
    query GetCustomerWishlist {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            is_sender
            wishlists {
                id
                shared_count
                date
                ...WishlistPageFragment
            }
        }
    }
    ${WishlistPageFragment}
`;

export const GET_CUSTOMER_WISHLIST_ITEMS = gql`
    query getCustomerWishlist($id: ID!, $pageSize: Int!, $currentPage: Int) {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            is_sender
            wishlist_v2(id: $id) {
                id
                is_rss_enabled
                items_v2(pageSize: $pageSize, currentPage: $currentPage) {
                    items {
                        id
                        quantity
                        description
                        ...WishlistItemFragment
                    }
                    page_info {
                        page_size
                        current_page
                        total_pages
                    }
                }
            }
            shared_items {
                shared
                sharing_code
                shared_email
                wishlist_id
                updated_at
                created_at_store
            }
        }
    }
    ${WishlistItemFragment}
`;

export const UPDATE_WISHLIST = gql`
    mutation UpdateWishlist($name: String!, $visibility: WishlistVisibilityEnum!, $wishlistId: ID!) {
        updateWishlist(name: $name, visibility: $visibility, wishlistId: $wishlistId) {
            name
            uid
            visibility
        }
    }
`;

export const ADD_ALL_WISHLIST = gql`
    mutation AddSharedWishlistItemsToCart($sharingCode: String!, $cartId: String!) {
        addSharedWishlistItemsToCart(sharingCode: $sharingCode, cartId: $cartId) {
            status
            cart {
                id
                ...MiniCartFragment
                ...CartPageFragment
            }
        }
    }
    ${MiniCartFragment}
    ${CartPageFragment}
`;

export const SHARE_WISHLIST = gql`
    mutation SubmitSendWishlistForm(
        $emails: String!
        $coupon_code: String!
        $complementary: String
        $message: String
        $morning_message: String
        $morning_message_ar: String
        $night_message: String
        $night_message_ar: String
        $pro_tips: String
        $id: ID!
    ) {
        shareWishList(
            wishlistId: $id
            wishlistForm: {
                emails: $emails
                coupon_code: $coupon_code
                complementary: $complementary
                message: $message
                morning_message: $morning_message
                morning_message_ar: $morning_message_ar
                night_message_ar: $night_message_ar
                night_message: $night_message
                pro_tips: $pro_tips
                rss_url: "1"
            }
        ) {
            success
            message
        }
    }
`;

export default {
    getCustomerWishlistQuery: GET_CUSTOMER_WISHLIST,
    getCustomerWishlistItems: GET_CUSTOMER_WISHLIST_ITEMS,
    updateWishlistMutation: UPDATE_WISHLIST,
    shareWishListMutation: SHARE_WISHLIST,
    addAllProductToCart: ADD_ALL_WISHLIST
};
