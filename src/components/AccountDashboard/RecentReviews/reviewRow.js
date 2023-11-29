import React from 'react';
import { FormattedMessage } from 'react-intl';

import RatingStars from '@app/components/RatingStars';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import Link from '@magento/venia-ui/lib/components/Link';

import classes from './reviewRow.module.css';
const ReviewRow = ({ review }) => {
    const { product, average_rating } = review || {};
    const { name, url: productLink } = product || {};

    const formattedUrl = productLink.split('/').pop();

    const reviewStarCount = average_rating / 20; // To get star count for reviews

    return (
        <li className={classes.root}>
            <div className={classes.productNameContainer}>
                <Link to={resourceUrl(formattedUrl)}>
                    <span className={classes.productName}>{name}</span>
                </Link>
            </div>
            <div className={classes.ratingContainer}>
                <div className={classes.ratingLabel}>
                    <FormattedMessage id="reviewRow.rating" defaultMessage="Rating:" />
                </div>
                <RatingStars maxCount={reviewStarCount} current={reviewStarCount} width={15} height={15} />
            </div>
        </li>
    );
};
export default ReviewRow;
