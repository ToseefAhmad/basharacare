import { shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './styledHeading.module.css';

const StyledHeading = ({ title, classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);

    if (!title) {
        return null;
    }

    const headingParts = title.split(' ');

    return (
        <h1 className={classes.heading}>
            {headingParts.shift()}
            {headingParts.map((word, idx) => (
                <span className={classes.headingNormal} key={`${word}${idx}`}>
                    {' '}
                    {word}
                </span>
            ))}
        </h1>
    );
};

StyledHeading.propTypes = {
    title: string,
    classes: shape({
        heading: string,
        headingNormal: string
    })
};

export default StyledHeading;
