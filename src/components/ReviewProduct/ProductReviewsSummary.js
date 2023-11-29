import { number, shape } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import RatingStars from '@app/components/RatingStars';
import iconClasses from '@app/components/StyleGuide/icons.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './productReviews.module.css';

const ProductReviewsSummary = ({ review, maxCount, height, reviewClick, reviewPath, width, ...props }) => {
    const classes = useStyle(defaultClasses, props.classes);

    if (!review.review_count) {
        return null;
    }

    const { review_count: count, rating_summary: ratingSummary } = review;
    const current = ratingSummary / (100 / maxCount);

    let reviewText;
    if (!count) return;

    if (count === 1) {
        reviewText = <FormattedMessage id="reviewLabel.singular" defaultMessage="review" />;
    }

    if (count > 999) {
        reviewText = <FormattedMessage id="reviewLabel.thousand" defaultMessage="k" />;
    }
    if (count < 999 && count > 1) {
        reviewText = <FormattedMessage id="reviewLabel.plural" defaultMessage="reviews" />;
    }

    const reviewCount = count > 1000 ? count / 1000 : count;

    const reviewTextFull = (
        <FormattedMessage
            id="productReviewSummary.reviewText"
            defaultMessage="{count} {reviewText}"
            values={{
                count: reviewCount,
                reviewText: reviewText
            }}
        />
    );

    return (
        <div className={classes.root}>
            <div className={classes.starsContainer}>
                <RatingStars
                    maxCount={maxCount}
                    current={current}
                    classes={{
                        active: iconClasses.starBlack,
                        inactive: iconClasses.starBrownInactive
                    }}
                    width={width}
                    height={height}
                />
                <div className={classes.reviewsRating}>
                    <span>{current}</span>
                    <span>/</span>
                    <span>{maxCount}</span>
                </div>
            </div>

            <div className={classes.reviewLink}>
                {reviewPath && reviewPath !== '#' ? (
                    <Link onClick={reviewClick} to={reviewPath} className={classes.name} data-cy="GalleryItem-name">
                        {reviewTextFull}
                    </Link>
                ) : (
                    <div className={classes.name}>{reviewTextFull}</div>
                )}
            </div>
        </div>
    );
};

ProductReviewsSummary.propTypes = {
    review: shape({
        rating_summary: number,
        review_count: number
    })
};

ProductReviewsSummary.defaultProps = {
    maxCount: 5,
    width: 20,
    height: 20
};

export default ProductReviewsSummary;
