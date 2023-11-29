import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './review.module.css';

const ReviewShimmer = ({ classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <div className={classes.root}>
            <div className={classes.name}>
                <Shimmer width={6} height={1} key="productFullDetail.reviews.nameMobile" />
            </div>
            <div className={classes.dateMobile}>
                <Shimmer width={6} height={4} key="productFullDetail.reviews.dateMobile" />
            </div>
            <div className={classes.starRating}>
                <Shimmer width={8} height={1.5} key="productFullDetail.reviews.starRating" />
            </div>
            <div className={classes.summary}>
                <Shimmer width={8} height={1.5} key="productFullDetail.reviews.summary" />
                <div className={classes.desktopNameBlock}>
                    <Shimmer width={8} height={1.5} key="productFullDetail.reviews.nameDesktop" />
                </div>
            </div>
            <div className={classes.reviewText}>
                <Shimmer width="100%" height={10} key="productFullDetail.reviews.review" />
            </div>
            <div className={classes.desktopDate}>
                <Shimmer width={4} height={1.5} key="productFullDetail.reviews.nameDesktop" />
            </div>
        </div>
    );
};

export default ReviewShimmer;
