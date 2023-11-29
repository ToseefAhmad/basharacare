import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import SharedWishlist from '@app/components/overrides/WishlistPage/SharedWishlists/sharedWishlist';

import classes from './sharedWishlists.module.css';

const SharedWishlists = ({ sharedItems = [], currentWishlistId }) => {
    const wishlistElements = useMemo(() => {
        return sharedItems.map(wishlist => (
            <SharedWishlist key={wishlist.wishlist_id} wishlist={wishlist} currentWishlistId={currentWishlistId} />
        ));
    }, [currentWishlistId, sharedItems]);
    return (
        <div className={classes.root}>
            <span className={classes.title}>
                <FormattedMessage id="sharedWishlists.headerLabel" defaultMessage="Shared Wishlists" />
            </span>
            <div className={classes.tableHeader}>
                <span>
                    <FormattedMessage id="sharedWishlists.OrderNumberLabel" defaultMessage="#" />
                </span>
                <span>
                    <FormattedMessage id="sharedWishlists.DateLabel" defaultMessage="Date" />
                </span>
                <span>
                    <FormattedMessage id="sharedWishlists.SharedEmail" defaultMessage="Shared Email" />
                </span>
                <span>
                    <FormattedMessage id="sharedWishlists.SharedTo" defaultMessage="Shared To" />
                </span>
                <span>
                    <FormattedMessage id="sharedWishlists.SharedInStore" defaultMessage="Shared In Store" />
                </span>
                <span>
                    <FormattedMessage id="sharedWishlists.ActionLabel" defaultMessage="Action" />
                </span>
            </div>
            {wishlistElements}
        </div>
    );
};
export default SharedWishlists;
