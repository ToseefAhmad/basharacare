import { array } from 'prop-types';
import React from 'react';

import { useWindowSize } from '@magento/peregrine';

import FilterBlock from './filterBlock';
import FilterModal from './FilterModal';
import FilterNumeric from './filterNumeric';
import classes from './filters.module.css';

const Filters = ({ attributes, disjunctiveFacets }) => {
    const isMobile = useWindowSize().innerWidth < 1024;

    const filterBlocks = attributes?.map(attribute => {
        if (attribute.attribute.includes('price')) {
            const facet = disjunctiveFacets.find(facet => facet.name === attribute.attribute);
            if (facet) {
                return (
                    <FilterNumeric
                        key={attribute.attribute}
                        attribute={attribute.attribute}
                        label={attribute.label}
                        defaultRefinement={{
                            min: facet.stats.min,
                            max: facet.stats.max
                        }}
                        max={facet.stats.max}
                        min={facet.stats.min}
                    />
                );
            }
            return <FilterNumeric key={attribute.attribute} attribute={attribute.attribute} />;
        }

        return <FilterBlock key={attribute.attribute} attribute={attribute.attribute} label={attribute.label} />;
    });

    return (
        <>
            {!isMobile ? <div className={classes.root}>{filterBlocks}</div> : <FilterModal>{filterBlocks}</FilterModal>}
        </>
    );
};

Filters.propTypes = {
    attributes: array,
    disjunctiveFacets: array
};

export default Filters;
