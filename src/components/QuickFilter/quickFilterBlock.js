import { useAmIlnContext } from '@amasty/iln/src/context';
import { Form } from 'informed';
import { groupBy, keyBy } from 'lodash';
import { arrayOf, bool, func, number, oneOfType, shape, string } from 'prop-types';
import React, { useMemo } from 'react';

import { isFilterBlockHidden } from '@app/components/overrides/FilterModal/useFilterBlock';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './quickFilterBlock.module.css';
import QuickFilterList from './quickFilterList';

const QuickFilterBlock = ({ filterApi, items, onApply, currentFilters, filterResults, children, ...props }) => {
    const { amshopby_general_keep_single_choice_visible } = useAmIlnContext() || {};
    const itemsByGroup = groupBy(items, item => item.group);

    const talonPropsByGroup = useMemo(
        () =>
            keyBy(
                Object.keys(itemsByGroup).map(group => {
                    const itemsWithData = itemsByGroup[group];
                    const filterState = itemsWithData[0].filterState;
                    const items = itemsWithData.map(item => item.item);
                    const filterBlockSettings = filterApi.getAmFilterData(group);
                    const isHidden = isFilterBlockHidden(
                        filterState,
                        filterBlockSettings,
                        amshopby_general_keep_single_choice_visible
                    );

                    return { filterState, items, filterBlockSettings, group, isHidden };
                }),
                talonProps => talonProps.group
            ),
        [itemsByGroup, amshopby_general_keep_single_choice_visible, filterApi]
    );

    const filteredItems = items
        .map(item => {
            // eslint-disable-next-line no-unused-vars
            const { items, ...talonProps } = talonPropsByGroup[item.group];

            return {
                ...item,
                ...talonProps
            };
        })
        .filter(item => !item.isHidden);

    const classes = useStyle(defaultClasses, props.classes);

    if (!filteredItems.length) return null;

    return (
        <Form className={classes.list}>
            <QuickFilterList
                filterResults={filterResults}
                currenFilters={currentFilters}
                filterApi={filterApi}
                items={filteredItems}
                onApply={onApply}
                showProductQuantities={false}
                classes={{ item: classes.item, root: classes.label, root_selected: classes.label_selected }}
            >
                {children}
            </QuickFilterList>
        </Form>
    );
};

QuickFilterBlock.defaultProps = {
    onApply: null,
    initialOpen: false
};

QuickFilterBlock.propTypes = {
    classes: shape({
        header: string,
        list: string,
        name: string,
        root: string,
        trigger: string
    }),
    filterApi: shape({}).isRequired,
    items: arrayOf(shape({})),
    onApply: func,
    initialOpen: oneOfType([bool, number])
};

export default QuickFilterBlock;
