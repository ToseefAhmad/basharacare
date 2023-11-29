import { array, arrayOf, shape, string } from 'prop-types';
import React, { useMemo } from 'react';
import { FocusScope } from 'react-aria';
import { X as CloseIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import CircleButton from '@app/components/CircleButton/circleButton';
import FilterBlock from '@app/components/overrides/FilterModal/filterBlock';
import LinkButton from '@app/components/overrides/LinkButton';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Portal } from '@magento/venia-ui/lib/components/Portal';

import FilterFooter from './filterFooter';
import defaultClasses from './filterModal.module.css';

/**
 * A view that displays applicable and applied filters.
 *
 * @param {Object} props.filters - filters to display
 */
const FilterModal = props => {
    const { formatMessage } = useIntl();
    const {
        isOpen,
        handleClose,
        handleKeyDownActions,
        filterCountToOpen,
        filterItems,
        filterState,
        filterNames,
        filterApi,
        handleApply,
        handleReset,
        currentFilters
    } = props;

    const classes = useStyle(defaultClasses, props.classes);
    const modalClass = isOpen ? classes.root_open : classes.root;

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
                        initialOpen={iteration < filterCountToOpen}
                        onApply={handleApply}
                    />
                );
            }),
        [filterItems, filterState, filterNames, filterApi, filterCountToOpen, handleApply]
    );

    const filtersAriaLabel = formatMessage({
        id: 'filterModal.filters.ariaLabel',
        defaultMessage: 'Filters'
    });

    const closeAriaLabel = formatMessage({
        id: 'filterModal.filters.close.ariaLabel',
        defaultMessage: 'Close filters popup.'
    });

    const clearAllAriaLabel = formatMessage({
        id: 'filterModal.action.clearAll.ariaLabel',
        defaultMessage: 'Clear all applied filters'
    });

    const clearAll = filterState.size ? (
        <div className={classes.action}>
            <LinkButton
                type="button"
                onClick={handleReset}
                aria-label={clearAllAriaLabel}
                data-cy="FilterModal-clearButton"
            >
                <FormattedMessage id="filterModal.action" defaultMessage="Clear all" />
            </LinkButton>
        </div>
    ) : null;

    if (!isOpen) {
        return null;
    }

    return (
        <Portal>
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <FocusScope contain restoreFocus autoFocus>
                {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
                <aside className={modalClass} onKeyDown={handleKeyDownActions} data-cy="FilterModal-root">
                    <div className={classes.body}>
                        <div className={classes.header}>
                            <h2 className={classes.headerTitle}>
                                <FormattedMessage id="filterModal.headerTitles" defaultMessage="Filter" />
                            </h2>

                            <CircleButton onClick={handleClose} aria-disabled={false} aria-label={closeAriaLabel}>
                                <CloseIcon />
                            </CircleButton>
                        </div>
                        {currentFilters}
                        <ul className={classes.blocks} aria-label={filtersAriaLabel}>
                            <div className={classes.filterListContainer}>{filtersList}</div>
                        </ul>
                    </div>
                    <FilterFooter
                        applyFilters={handleClose}
                        closeModal={handleClose}
                        hasFilters={!!filterState.size}
                        isOpen={isOpen}
                    >
                        {clearAll}
                    </FilterFooter>
                </aside>
            </FocusScope>
        </Portal>
    );
};

FilterModal.propTypes = {
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
    )
};

export default FilterModal;
