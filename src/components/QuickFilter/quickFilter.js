import { array, arrayOf, number, shape, string } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './quickfilter.module.css';
import QuickFilterBlock from './quickFilterBlock';

const QuickFilter = props => {
    const { filterItems, filterState, filterApi, handleApply, handleReset } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const filtersList = useMemo(() => {
        const itemsWithData = [];
        const filters = ['bc_product_type', 'treatment'];

        filters.forEach(function(group) {
            const items = filterItems.get(group);
            const groupState = filterState.get(group);

            if (items) {
                items.forEach(item => {
                    itemsWithData.push({
                        item,
                        group,
                        filterState: groupState
                    });
                });
            }
        });

        const content = itemsWithData.sort((a, b) => b.item.count - a.item.count).slice(0, 8);

        const isSelected = filterState.size === 1;

        return (
            <QuickFilterBlock key="quick_filter_block" filterApi={filterApi} items={content} onApply={handleApply}>
                <span className={isSelected ? classes.clearAllInactive : classes.clearAll}>
                    <button type="button" onClick={handleReset}>
                        <FormattedMessage id="quickFilter.action" defaultMessage="all products" />
                    </button>
                </span>
            </QuickFilterBlock>
        );
    }, [classes.clearAll, classes.clearAllInactive, filterApi, filterItems, filterState, handleApply, handleReset]);

    return (
        <div className={classes.body}>
            {/* <div className={classes.title}>/ Quick Filters:</div> */}
            {filtersList}
        </div>
    );
};

QuickFilter.defaultProps = {
    filterCountToOpen: 3
};

QuickFilter.propTypes = {
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

export default QuickFilter;
