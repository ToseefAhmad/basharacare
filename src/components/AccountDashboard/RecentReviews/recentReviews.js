import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './recentReviews.module.css';
import ReviewRow from './reviewRow';
const RecentReviews = props => {
    const { productReviews, isLoadingWithoutData } = props;

    const reviewRows = useMemo(() => {
        return productReviews.map((review, index) => {
            return <ReviewRow key={index} review={review} />;
        });
    }, [productReviews]);

    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
            return (
                <LoadingIndicator>
                    <FormattedMessage id="productReviews.loading" defaultMessage="Fetching Product Reviews..." />
                </LoadingIndicator>
            );
        } else if (reviewRows.length === 0 && !isLoadingWithoutData) {
            return (
                <div className={classes.productReviewsEmpty}>
                    <FormattedMessage id="productReviews.noProductReviewsMessage" defaultMessage="No reviews to Show" />
                </div>
            );
        } else {
            return <ul className={classes.productReviews}>{reviewRows}</ul>;
        }
    }, [isLoadingWithoutData, reviewRows]);

    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <h2>
                    <FormattedMessage id="recentReviewsPage.Title" defaultMessage="My Recent" />
                </h2>
                <h2>
                    <FormattedMessage id="recentReviewsPage.Secondary" defaultMessage="Reviews" />
                </h2>
            </div>
            {pageContents}
        </div>
    );
};
export default RecentReviews;
