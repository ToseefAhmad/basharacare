import classNames from 'classnames';
import React, { useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Star } from '@app/components/Icons';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './starReview.module.css';

const StarReview = ({ classes: propClasses, width, height, title, setStarRating, reset, showError }) => {
    const classes = useStyle(defaultClasses, propClasses);

    const [rating, setRating] = useState(-1);
    const [temporaryRating, setTemporaryRating] = useState(1);
    const [starContainerEntered, setStarContainerEntered] = useState(false);

    const changeRating = index => {
        setStarRating(index + 1);
        setRating(index);
    };

    useEffect(() => {
        setRating(-1);
        setTemporaryRating(1);
    }, [reset]);

    const isRequiredError = showError ? (
        <div className={classes.errorMessage}>
            <FormattedMessage id="review.isRequired" defaultMessage="Is required." />
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.title}>{title}</div>
            <div
                onMouseEnter={() => setStarContainerEntered(true)}
                onMouseLeave={() => setStarContainerEntered(false)}
                className={classes.starContainer}
            >
                {new Array(5).fill(null).map((_, index) => {
                    return (
                        <button
                            type="button"
                            onClick={() => changeRating(index)}
                            onMouseEnter={() => setTemporaryRating(index)}
                            key={index}
                            className={classNames(classes.star, {
                                [classes.active]: !starContainerEntered && index <= rating,
                                [classes.inactive]: !starContainerEntered && index > rating,
                                [classes.activeTemporary]: starContainerEntered && index <= temporaryRating,
                                [classes.inactiveTemporary]: starContainerEntered && index > temporaryRating
                            })}
                        >
                            <Star width={width} height={height} />
                        </button>
                    );
                })}
            </div>
            {isRequiredError}
        </div>
    );
};

export default StarReview;
