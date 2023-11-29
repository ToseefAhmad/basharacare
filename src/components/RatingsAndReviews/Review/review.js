import classNames from 'classnames';
import { shape, string } from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import ProductReviewsSummary from '@app/components/ReviewProduct/ProductReviewsSummary';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './review.module.css';

const Review = ({ review, classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);

    const getDate = timestamp => {
        const separatedTimeAndDate = timestamp.split(' ');
        const dateArray = separatedTimeAndDate[0].split('-');

        return dateArray.join('/');
    };

    const getStarRating = average_rating => {
        return {
            review_count: 1,
            rating_summary: average_rating
        };
    };

    const [showLongerText, setShowLongerText] = useState(false);

    const ShowMoreButton = () => {
        if (review.text.length > 250 && !showLongerText) {
            return (
                <button className={classes.showMore} onClick={() => setShowLongerText(true)}>
                    <FormattedMessage id="productReview.showMore" defaultMessage="...Show more" />
                </button>
            );
        } else if (review.text.length > 250 && showLongerText) {
            return (
                <button className={classes.showMore} onClick={() => setShowLongerText(false)}>
                    <FormattedMessage id="productReview.showLess" defaultMessage="...Show less" />
                </button>
            );
        }

        return null;
    };

    return (
        <div className={classes.root}>
            <div className={classes.name}>{review.nickname}</div>
            <div className={classes.dateMobile}>
                <FormattedMessage id="productFullDetail.reviews.verifiedBuyer" defaultMessage="Verified buyer" />
                <div>{getDate(review.created_at)}</div>
            </div>
            <div className={classes.starRating}>
                <ProductReviewsSummary
                    review={getStarRating(review.average_rating)}
                    classes={{ reviewLink: classes.hiddenItems, reviewsRating: classes.hiddenItems }}
                />
            </div>
            <div className={classes.summary}>
                {review.summary}
                <div className={classes.desktopNameBlock}>
                    <FormattedMessage id="productFullDetail.reviews.reviewBy" defaultMessage="Review by" />
                    <div className={classes.desktopName}>{review.nickname}</div>
                </div>
            </div>
            <div
                className={classNames(classes.reviewText, {
                    [classes.shortText]: !showLongerText && review.text.length > 250,
                    [classes.fullText]: showLongerText,
                    [classes.standardText]: review.text.length <= 250
                })}
            >
                {review.text}
            </div>
            <ShowMoreButton />
            <div className={classes.desktopDate}>{getDate(review.created_at)}</div>
        </div>
    );
};

Review.propTypes = {
    classes: shape({
        root: string,
        name: string,
        dateMobile: string,
        starRating: string,
        summary: string,
        desktopNameBlock: string,
        desktopName: string,
        reviewText: string,
        shortText: string,
        fullText: string,
        standardText: string,
        showMore: string,
        desktopDate: string,
        hiddenItems: string
    })
};

export default Review;
