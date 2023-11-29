import { shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './breadcrumbs.module.css';

const BreadcrumbsShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.breadcrumbContainer}>
                <Shimmer classes={{ root_rectangle: classes.shimmer }} />
            </div>
        </div>
    );
};

BreadcrumbsShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default BreadcrumbsShimmer;
