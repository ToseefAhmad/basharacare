import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './paginator.module.css';

const PaginatorShimmer = ({ classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <div className={classes.paginatorBlock}>
            <div className={classes.paginator}>
                <Shimmer key="productFullDetail.reviews.paginator" width={20} height={1.5} />
            </div>
        </div>
    );
};

export default PaginatorShimmer;
