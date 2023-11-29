import { useCallback } from 'react';

import { useRewardsAccount } from '@app/components/RewardsAccount/useRewardsAccount';
import { useUserContext } from '@magento/peregrine/lib/context/user';

/**
 * @param {Object}      props
 * @param {Function}    props.onSignOut - A function to call when sign out occurs.
 *
 * @returns {Object}    result
 * @returns {Function}  result.handleSignOut - The function to handle sign out actions.
 */
export const useAccountMenuItems = props => {
    const { onSignOut } = props;

    const { amount } = useRewardsAccount();
    const [{ currentUser }] = useUserContext();

    const fullName = currentUser.firstname + ' ' + currentUser.lastname;

    const handleSignOut = useCallback(() => {
        onSignOut();
    }, [onSignOut]);

    const MENU_ITEMS = [
        {
            name: 'My Account',
            id: 'accountMenu.myAccountLink',
            url: '/account-dashboard'
        },
        {
            name: 'My Wishlist',
            id: 'accountMenu.wishlistLink',
            url: '/wishlist'
        }
    ];

    return {
        handleSignOut,
        menuItems: MENU_ITEMS,
        rewardPoints: amount,
        fullName
    };
};
