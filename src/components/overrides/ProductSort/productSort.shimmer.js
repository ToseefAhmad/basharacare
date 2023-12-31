import { shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './productSort.shimmer.module.css';

const ProductSortShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer classes={{ root_button: classes.sortButtonShimmer }} type="button" />
        </div>
    );
};

ProductSortShimmer.propTypes = {
    classes: shape({
        root: string,
        sortButtonShimmer: string
    })
};

export default ProductSortShimmer;
