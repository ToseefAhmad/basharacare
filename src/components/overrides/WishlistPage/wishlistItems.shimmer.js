import { shape, string } from 'prop-types';
import React from 'react';

import WishlistItemShimmer from '@app/components/overrides/WishlistPage/wishlistItem.shimmer';
import { useStyle } from '@magento/venia-ui/lib//classify';

import defaultClasses from './wishlistItems.shimmer.module.css';

const WishlistItemsShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { items } = props;

    const placeholderItems = items.slice(0, 8);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.items}>
                {placeholderItems.map((item, index) => (
                    <WishlistItemShimmer key={index} />
                ))}
            </div>
        </div>
    );
};

WishlistItemsShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default WishlistItemsShimmer;
