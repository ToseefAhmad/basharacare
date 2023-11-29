import { gql } from '@apollo/client';

import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql';

export const REORDER_ITEMS = gql`
    mutation ReorderItems($orderNumber: String!) {
        reorderItems(orderNumber: $orderNumber) {
            cart {
                id
                ...CartPageFragment
            }
        }
    }
    ${CartPageFragment}
`;
