import ShowMoreLessButton from '@amasty/iln/src/components/FilterList/showMoreLessButton';
import { useCurrentFilters } from '@amasty/iln/src/talons/useCurrentFilters';
import { func, shape, string } from 'prop-types';
import React, { useMemo, Fragment } from 'react';
import { useIntl } from 'react-intl';

import CurrentFilter from './currentFilter';
import defaultClasses from './currentFilters.module.css';

const CurrentFilters = ({ filterApi, filterState, onRemove, clearAll }) => {
    const { removeItem } = filterApi;
    const { formatMessage } = useIntl();
    const { classes, getItemClassName, unfoldedOptions, stateLength, isExpanded, handleListToggle } = useCurrentFilters(
        { filterState, classes: defaultClasses }
    );

    // Create elements and params at the same time for efficiency
    const filterElements = useMemo(() => {
        const elements = [];
        for (const [group, items] of filterState) {
            for (const item of items) {
                const { title, value } = item || {};
                const key = `${group}::${title}_${value}`;
                elements.push(
                    <div className={getItemClassName(elements)} key={key}>
                        <CurrentFilter group={group} item={item} removeItem={removeItem} onRemove={onRemove} />
                    </div>
                );
            }
        }

        return elements;
    }, [filterState, getItemClassName, removeItem, onRemove]);

    const currentFiltersAriaLabel = formatMessage({
        id: 'filterModal.currentFilters.ariaLabel',
        defaultMessage: 'Current Filters'
    });

    return (
        <Fragment>
            <div className={classes.root} aria-label={currentFiltersAriaLabel}>
                {filterElements} {clearAll}
            </div>
            <div className={classes.showMore}>
                <ShowMoreLessButton
                    itemCountToShow={unfoldedOptions}
                    itemsLength={stateLength}
                    isListExpanded={isExpanded}
                    handleListToggle={handleListToggle}
                />
            </div>
        </Fragment>
    );
};

CurrentFilters.defaultProps = {
    onRemove: null
};

CurrentFilters.propTypes = {
    classes: shape({
        root: string,
        item: string,
        button: string,
        icon: string
    }),
    onRemove: func
};

export default CurrentFilters;
