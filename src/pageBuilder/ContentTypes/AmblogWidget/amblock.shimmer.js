import { shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './amblock.shimmer.module.css';

const AmBlockShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Shimmer
            aria-live="polite"
            aria-busy="true"
            classes={{
                root_rectangle: classes.root
            }}
        />
    );
};

AmBlockShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default AmBlockShimmer;
