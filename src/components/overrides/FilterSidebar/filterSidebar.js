import customClasses from '@amasty/iln/src/extendStyle/filterSidebar.css';
import { array, arrayOf, shape, string, number } from 'prop-types';
import React, { useMemo, useCallback, useRef } from 'react';

import FilterBlock from '@app/components/overrides/FilterModal/filterBlock';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './filterSidebar.module.css';

const SCROLL_OFFSET = 150;

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterSidebar = props => {
    const { filterCountToOpen, filterItems, filterState, filterNames, filterApi, handleApply, currentFilters } = props;

    const filterRef = useRef();
    const classes = useStyle(defaultClasses, customClasses, props.classes);

    const handleApplyFilter = useCallback(
        (...args) => {
            const filterElement = filterRef.current;
            if (filterElement && typeof filterElement.getBoundingClientRect === 'function') {
                const filterTop = filterElement.getBoundingClientRect().top;
                const windowScrollY = window.scrollY + filterTop - SCROLL_OFFSET;

                if (window.scrollY > windowScrollY) {
                    window.scrollTo(0, windowScrollY);
                }
            }

            handleApply(...args);
        },
        [handleApply, filterRef]
    );

    const filtersList = useMemo(
        () =>
            Array.from(filterItems, ([group, items], iteration) => {
                const blockState = filterState.get(group);
                const groupName = filterNames.get(group);

                return (
                    <FilterBlock
                        key={group}
                        filterApi={filterApi}
                        filterState={blockState}
                        group={group}
                        items={items}
                        name={groupName}
                        onApply={handleApplyFilter}
                        initialOpen={iteration < filterCountToOpen}
                    />
                );
            }),
        [filterApi, filterItems, filterNames, filterState, filterCountToOpen, handleApplyFilter]
    );

    return (
        <aside
            className={classes.root}
            ref={filterRef}
            data-cy="FilterSidebar-root"
            aria-live="polite"
            aria-busy="false"
        >
            <div className={classes.body}>
                {currentFilters}
                <div className={classes.blocks}>{filtersList}</div>
            </div>
        </aside>
    );
};

FilterSidebar.defaultProps = {
    filterCountToOpen: 3
};

FilterSidebar.propTypes = {
    classes: shape({
        action: string,
        blocks: string,
        body: string,
        header: string,
        headerTitle: string,
        root: string,
        root_open: string
    }),
    filters: arrayOf(
        shape({
            attribute_code: string,
            items: array
        })
    ),
    filterCountToOpen: number
};

export default FilterSidebar;
