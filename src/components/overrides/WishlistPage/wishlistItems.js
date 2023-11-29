import React, { Fragment } from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import { useWishlistItems } from './useWishlistItems';
import WishlistItem from './wishlistItem';
import defaultClasses from './wishlistItems.module.css';

const WishlistItems = props => {
    const { items, wishlistId, isSender, updateItems } = props;
    const talonProps = useWishlistItems();
    const { handleOpenAddToCartDialog } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const itemElements = items.map(item => {
        return (
            <WishlistItem
                key={item.id}
                item={item}
                isSender={isSender}
                updateItems={updateItems}
                onOpenAddToCartDialog={handleOpenAddToCartDialog}
                wishlistId={wishlistId}
            />
        );
    });

    return (
        <Fragment>
            <div className={classes.root}>{itemElements}</div>
        </Fragment>
    );
};

export default WishlistItems;
