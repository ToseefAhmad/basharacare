import classNames from 'classnames';
import { number, string, shape } from 'prop-types';
import React from 'react';

import { Star } from '@app/components/Icons';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './ratingStars.module.css';

const RatingStars = ({ maxCount, current, classes: propClasses, width, height }) => {
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <div className={classes.starContainer}>
            {new Array(maxCount).fill(null).map((_, index) => {
                return (
                    <span
                        id={index}
                        key={index}
                        className={classNames(classes.star, {
                            [classes.active]: index < current,
                            [classes.inactive]: index >= current
                        })}
                    >
                        <Star width={width} height={height} />
                    </span>
                );
            })}
        </div>
    );
};

RatingStars.propTypes = {
    maxCount: number.isRequired,
    current: number.isRequired,
    classes: shape({
        active: string,
        inactive: string
    }),
    width: number,
    height: number
};

export default RatingStars;
