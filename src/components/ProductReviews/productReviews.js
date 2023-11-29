import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import Pagination from '@app/components/overrides/Pagination/pagination';
import ReviewRow from '@app/components/ProductReviews/reviewRow';
import { useProductReviews } from '@app/components/ProductReviews/useProductReviews';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './productReviews.module.css';
const ProductReviews = () => {
    const { productReviews, isLoadingReviews, pageControl } = useProductReviews();

    const reviewRows = useMemo(() => {
        return productReviews.map((review, index) => {
            return <ReviewRow key={index} review={review} />;
        });
    }, [productReviews]);

    const pageContents = useMemo(() => {
        if (isLoadingReviews) {
            return (
                <LoadingIndicator>
                    <FormattedMessage id="productReviews.loading" defaultMessage="Fetching Product Reviews..." />
                </LoadingIndicator>
            );
        } else if (reviewRows.length === 0 && !isLoadingReviews) {
            return (
                <div className={classes.productReviewsEmpty}>
                    <FormattedMessage id="productReviews.noProductReviewsMessage" defaultMessage="No reviews to Show" />
                </div>
            );
        } else {
            return (
                <>
                    <div className={classes.tableHeader}>
                        <span>
                            <FormattedMessage id="productReviews.CreatedLabel" defaultMessage="Created" />
                        </span>
                        <span>
                            <FormattedMessage id="productReviews.ProductNameLabel" defaultMessage="Product Name" />
                        </span>
                        <span>
                            <FormattedMessage id="productReviews.RatingLabel" defaultMessage="Rating" />
                        </span>
                        <span>
                            <FormattedMessage id="productReviews.ReviewLabel" defaultMessage="Review" />
                        </span>
                    </div>
                    <ul className={classes.productReviewsTable}>{reviewRows}</ul>
                    <Pagination pageControl={pageControl} />
                </>
            );
        }
    }, [isLoadingReviews, pageControl, reviewRows]);

    return <div className={classes.root}>{pageContents}</div>;
};
export default ProductReviews;
