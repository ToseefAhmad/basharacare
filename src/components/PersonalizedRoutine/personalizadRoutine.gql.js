import { gql } from '@apollo/client';

import { WishlistItemFragment } from '@app/components/overrides/WishlistPage/wishlistItemFragments.gql';
import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql';
import { MiniCartFragment } from '@magento/peregrine/lib/talons/MiniCart/miniCartFragments.gql';

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

export const GET_SURVEY_ITEMS_DATA = gql`
    query getCustomerSurveyItems($pageSize: Int!, $currentPage: Int) {
        customer {
            survey_items(pageSize: $pageSize, currentPage: $currentPage) {
                items {
                    entity_id
                    email
                    status
                    identifier
                    responses {
                        title
                        answers {
                            response_id
                            test_id
                            question_id
                            answer_ids
                            other_answer
                            image
                            text
                            title
                            created_at_store
                            created_at
                        }
                    }
                }
                page_info {
                    current_page
                    page_size
                    total_pages
                }
            }
        }
    }
`;

export const GET_ROUTINE_ACCOUNT_DATA = gql`
    query getCustomerRoutineData {
        customer {
            cms_top_advisor
            cms_bottom_advisor
            is_sender
            survey_items(pageSize: 1) {
                items {
                    entity_id
                    email
                    status
                    identifier
                    responses {
                        title
                        answers {
                            response_id
                            test_id
                            question_id
                            answer_ids
                            other_answer
                            image
                            text
                            title
                        }
                    }
                }
            }
        }
        getCustomerRoutine {
            wishlist_id
            sharing_code
            general_comment
            complementary_products
            coupon_code
            morning_message
            night_message
            morning_message_ar
            night_message_ar
            cms_top_advisor
            cms_bottom_advisor
        }
    }
`;

export const GET_WISHLIST_ROUTINE_PRODUCTS = gql`
    query getWishlistsBySharingCode($sharingCode: String!, $pageSize: Int!, $currentPage: Int) {
        getWishlistsBySharingCode(sharingCode: $sharingCode) {
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
    }
    ${WishlistItemFragment}
`;

export default {
    getCustomerRoutineQuery: GET_ROUTINE_ACCOUNT_DATA,
    getCustomerSurveyItemsQuery: GET_SURVEY_ITEMS_DATA,
    getWishlistsBySharingCodeQuery: GET_WISHLIST_ROUTINE_PRODUCTS,
    addAllProductToCartQuery: ADD_ALL_WISHLIST
};
