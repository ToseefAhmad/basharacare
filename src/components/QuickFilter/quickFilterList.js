import { array, shape, string, func, number } from 'prop-types';
import React, { useMemo } from 'react';

import QuickFilterItem from '@app/components/QuickFilter/quickFilterItem';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './quickFilterList.module.css';

const labels = new WeakMap();

const QuickFilterList = props => {
    const { children, items, ...rest } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    // Memoize item creation
    // Search value is not referenced, so this array is stable
    const itemElements = useMemo(
        () =>
            items.map((item, index) => {
                const { title, value } = item.item;
                const key = `item-${item.group}-${value}`;

                const element = <QuickFilterItem key={key} {...rest} {...item} index={index} />;

                labels.set(element, title.toUpperCase() || '');

                return element;
            }),
        [items, rest]
    );

    return (
        <div className={classes.items}>
            {children}
            {itemElements}
        </div>
    );
};

QuickFilterList.defaultProps = {
    onApply: null,
    itemCountToShow: 5
};

QuickFilterList.propTypes = {
    classes: shape({
        item: string,
        items: string
    }),
    filterApi: shape({}),
    items: array,
    onApply: func,
    itemCountToShow: number
};

export default QuickFilterList;
