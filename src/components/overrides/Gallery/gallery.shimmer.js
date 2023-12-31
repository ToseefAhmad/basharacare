import { shape, string, array, object } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './gallery.module.css';
import GalleryItemShimmer from './item.shimmer';

const GalleryShimmer = props => {
    const { items, itemProps } = props;
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root} aria-live="polite" aria-busy="true">
            <div className={classes.items}>
                {items.map((item, index) => (
                    <GalleryItemShimmer key={index} {...itemProps} />
                ))}
            </div>
        </div>
    );
};

GalleryShimmer.defaultProps = {
    items: [],
    itemProps: {}
};

GalleryShimmer.propTypes = {
    classes: shape({
        root: string,
        items: string
    }),
    items: array,
    itemProps: shape({
        classes: object
    })
};

export default GalleryShimmer;
