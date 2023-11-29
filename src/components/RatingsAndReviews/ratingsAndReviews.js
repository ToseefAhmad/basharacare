import { number, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import Paginator from './Paginator';
import defaultClasses from './ratingsAndReviews.module.css';
import Review from './Review';
import ReviewShimmer from './Review/review.shimmer';
import ReviewForm from './ReviewForm';
import { useRatingsAndReviews } from './useRatingsAndReviews';

const RatingsAndReviews = ({ classes: propClasses, name, sku, pageSize }) => {
    const classes = useStyle(defaultClasses, propClasses);

    const {
        reviews,
        isLoadingReviews,
        totalPages,
        currentPage,
        changeCurrentPage,
        paginatorArray
    } = useRatingsAndReviews({
        sku,
        pageSize
    });

    const reviewsElements = isLoadingReviews
        ? [...Array(3)].map((x, i) => <ReviewShimmer key={i} />)
        : reviews.length
        ? reviews.map((review, index) => <Review key={index} review={review} />)
        : null;

    return (
        <div className={classes.root} id="reviews">
            <div className={classes.title}>
                <div className={classes.titleBold}>
                    <FormattedMessage id="productFullDetail.reviewsLabel.ratings" defaultMessage="Ratings" />
                </div>
                <div className={classes.titleBold}>
                    <FormattedMessage id="productFullDetail.reviewsLabel.andSign" defaultMessage="&" />
                </div>
                <div>
                    <FormattedMessage id="productFullDetail.reviewsLabel.reviews" defaultMessage="Reviews" />
                </div>
            </div>
            {reviewsElements && (
                <>
                    <div className={classes.reviews}>{reviewsElements}</div>
                    <Paginator
                        showPaginator={totalPages > 1}
                        paginatorArray={paginatorArray}
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={changeCurrentPage}
                    />
                </>
            )}
            <ReviewForm productSku={sku} productName={name} />
        </div>
    );
};

RatingsAndReviews.propTypes = {
    classes: shape({
        root: string,
        title: string,
        titleBold: string,
        reviews: string
    }),
    pageSize: number,
    name: string.isRequired,
    sku: string.isRequired
};

RatingsAndReviews.defaultProps = {
    pageSize: 1
};

export default RatingsAndReviews;
