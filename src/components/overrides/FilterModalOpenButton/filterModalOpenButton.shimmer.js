import { shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './filterModalOpenButton.shimmer.module.css';

const FilterModalOpenButtonShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Shimmer
            classes={{ root_button: classes.filterButtonShimmer }}
            type="button"
            aria-live="polite"
            aria-busy="true"
        />
    );
};

FilterModalOpenButtonShimmer.propTypes = {
    classes: shape({
        filterButtonShimmer: string
    })
};

export default FilterModalOpenButtonShimmer;
