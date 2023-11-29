import { shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib//classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './itemShimmer.module.css';

const GalleryItemShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer className={classes.itemCardShimmer} width="100%" key="product-name" />
            <Shimmer className={classes.itemAddToCartShimmer} key="add-To-Cart" />
        </div>
    );
};

GalleryItemShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default GalleryItemShimmer;
