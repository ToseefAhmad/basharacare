import { shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './filterSidebar.module.css';

const FilterSidebar = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <aside className={classes.root} aria-live="polite" aria-busy="true">
            <Shimmer width="100%" height="810px" />
        </aside>
    );
};

FilterSidebar.propTypes = {
    classes: shape({
        root: string
    })
};

export default FilterSidebar;
