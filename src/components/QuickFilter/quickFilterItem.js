import FilterItem from '@amasty/iln/src/components/FilterList/filterItem';
import { useFilterList } from '@amasty/iln/src/talons/useFilterList';
import { shape, string, func, number, oneOfType } from 'prop-types';
import React from 'react';

import setValidator from '@magento/peregrine/lib/validators/set';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './quickFilterList.module.css';

const QuickFilterItem = props => {
    const { filterState, item, ...rest } = props;
    const items = [item];

    const { isListExpanded, itemCountToShow, itemProps, visibleItems } = useFilterList({
        ...props,
        items
    });

    const classes = mergeClasses(defaultClasses, props.classes);

    const { value } = item;
    const itemClass =
        visibleItems.has(value) && (isListExpanded || !itemCountToShow || index < itemCountToShow)
            ? classes.item
            : classes.itemHidden;

    return (
        <li className={itemClass}>
            <FilterItem filterState={filterState} item={item} {...itemProps} {...rest} />
        </li>
    );
};

QuickFilterItem.defaultProps = {
    onApply: null
};

QuickFilterItem.propTypes = {
    classes: shape({
        item: string,
        itemHidden: string
    }),
    filterApi: shape({}),
    filterState: setValidator,
    group: string,
    item: shape({
        title: string.isRequired,
        value: oneOfType([number, string]).isRequired
    }).isRequired,
    onApply: func,
    index: number
};

export default QuickFilterItem;
