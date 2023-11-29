import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import RatingStars from '@app/components/RatingStars';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Link from '@magento/venia-ui/lib/components/Link';

import classes from './reviewRow.module.css';
const ReviewRow = ({ review }) => {
    const { text: reviewText, product, created_at, average_rating } = review || {};
    const { brand_name, name, url: productLink } = product || {};
    const [isCollapsed, setIsCollapsed] = useState(true);

    const formattedUrl = productLink.split('/').pop();

    const reviewStarCount = average_rating / 20; // To get star count for reviews

    const maybeReadMoreDots = reviewText.length > 120 ? ' ...' : '';
    const shortReviewText = isCollapsed
        ? reviewText.replace(/^(.{100}[^\s]*).*/, '$1') + maybeReadMoreDots
        : reviewText;

    const handleContentToggle = () => {
        setIsCollapsed(!isCollapsed);
    };
    const getDate = timestamp => {
        const separatedTimeAndDate = timestamp.split(' ');
        const dateArray = separatedTimeAndDate[0].split('-');

        return dateArray.join('/');
    };

    const detailsButtonText = isCollapsed ? (
        <FormattedMessage id="reviewRow.seeDetails" defaultMessage="See Details" />
    ) : (
        <FormattedMessage id="reviewRow.hideDetails" defaultMessage="Hide Details" />
    );

    const maybeSeeDetailsButton =
        reviewText.length > 120 ? (
            <button className={classes.seeDetailsContainer} onClick={handleContentToggle} type="button">
                {detailsButtonText}
            </button>
        ) : null;

    return (
        <li className={classes.root}>
            <div className={classes.createdContainer}>
                <span className={classes.createdLabel}>
                    <FormattedMessage id="reviewRow.createdAt" defaultMessage="Created" />
                </span>
                <span className={classes.createdAt}>{getDate(created_at)}</span>
            </div>
            <div className={classes.productNameContainer}>
                <span className={classes.productNameLabel}>
                    <FormattedMessage id="reviewRow.productName" defaultMessage="Product Name" />
                </span>
                <div>
                    <div className={classes.brandName}>{brand_name}</div>
                    <Link to={resourceUrl(formattedUrl)}>
                        <span className={classes.productName}>{name}</span>
                    </Link>
                </div>
            </div>
            <div className={classes.ratingContainer}>
                <span className={classes.ratingLabel}>
                    <FormattedMessage id="reviewRow.rating" defaultMessage="Rating" />
                </span>
                <RatingStars maxCount={reviewStarCount} current={reviewStarCount} width={11.121} height={10.66} />
            </div>
            <div className={classes.reviewContainer}>
                <span className={classes.reviewLabel}>
                    <FormattedMessage id="reviewRow.review" defaultMessage="Review" />
                </span>
                <div className={classes.reviewText}>{shortReviewText}</div>
            </div>
            {maybeSeeDetailsButton}
        </li>
    );
};
export default ReviewRow;
