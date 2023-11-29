import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import classes from './sharedWishlist.module.css';

const WISHLIST_PATH = '/wishlist/';

const SharedWishlist = ({ wishlist, currentWishlistId }) => {
    const { wishlist_id, updated_at, shared, shared_email, created_at_store } = wishlist || {};

    const wishlistUrl = WISHLIST_PATH + wishlist_id;

    const isMainWishlist = parseInt(currentWishlistId) === parseInt(wishlist_id);

    const createdAtStoreText = isMainWishlist ? (
        <div>
            <FormattedMessage id="sharedWishlists.CurrentWishlist" defaultMessage="Current Store Wishlist" />
        </div>
    ) : (
        created_at_store
    );

    const viewButtonText = isMainWishlist ? (
        <FormattedMessage id="sharedWishlists.actionLabelCurrent" defaultMessage="view current" />
    ) : (
        <FormattedMessage id="sharedWishlists.actionLabel" defaultMessage="view" />
    );

    const sharedToText = !isMainWishlist ? (
        <FormattedMessage
            id="sharedWishlists.sharedToLabel"
            defaultMessage="{shared} customer(s)"
            values={{
                shared
            }}
        />
    ) : (
        ''
    );
    const sharedToEmail = !isMainWishlist ? shared_email : '';

    return (
        <div className={classes.root}>
            <div>{wishlist_id}</div>
            <div>{updated_at}</div>
            <div className={classes.sharedEmail}>{sharedToEmail}</div>
            <div>{sharedToText}</div>
            <div>{createdAtStoreText}</div>
            <div className={classes.viewWishlistButton}>
                <Link shouldprefetch="true" to={wishlistUrl}>
                    {viewButtonText}
                </Link>
            </div>
        </div>
    );
};

export default SharedWishlist;
