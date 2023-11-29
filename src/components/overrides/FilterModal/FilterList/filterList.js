import { useFilterList } from '@amasty/iln/src/talons/useFilterList';
import { array, shape, string, func, number } from 'prop-types';
import React, { Fragment, useMemo } from 'react';

import setValidator from '@magento/peregrine/lib/validators/set';
import { useStyle } from '@magento/venia-ui/lib/classify';

import FilterItem from './filterItem';
import defaultClasses from './filterList.module.css';

const labels = new WeakMap();

const FilterList = ({ filterApi, filterState, group, itemCountToShow, items, onApply, ...props }) => {
    const classes = useStyle(defaultClasses, props.classes);

    useFilterList({ filterApi, filterState, items, itemCountToShow });
    // Memoize item creation
    // Search value is not referenced, so this array is stable
    const itemElements = useMemo(
        () =>
            items.map(item => {
                const { title, value } = item;
                const key = `item-${group}-${value}`;

                // Create an element for each item
                const element = (
                    <div key={key} className={classes.item} data-cy="FilterList-item">
                        <FilterItem
                            filterApi={filterApi.filterApi}
                            filterState={filterState}
                            group={group}
                            item={item}
                            onApply={onApply}
                        />
                    </div>
                );

                // Associate each element with its normalized title
                // Titles are not unique, so use the element as the key
                labels.set(element, title.toUpperCase());

                return element;
            }),
        [classes, filterApi, filterState, group, items, onApply]
    );

    return (
        <Fragment>
            <div className={classes.items}>{itemElements}</div>
        </Fragment>
    );
};

FilterList.defaultProps = {
    onApply: null,
    itemCountToShow: 5
};

FilterList.propTypes = {
    classes: shape({
        item: string,
        items: string
    }),
    filterApi: shape({}),
    filterState: setValidator,
    group: string,
    items: array,
    onApply: func,
    itemCountToShow: number
};

export default FilterList;
