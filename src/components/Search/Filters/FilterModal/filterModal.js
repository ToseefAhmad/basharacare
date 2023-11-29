import { node } from 'prop-types';
import React from 'react';
import { FocusScope } from 'react-aria';
import { X as CloseIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import CircleButton from '@app/components/CircleButton/circleButton';
import FilterFooter from '@app/components/overrides/FilterModal/filterFooter';
import classes from '@app/components/overrides/FilterModal/filterModal.module.css';
import { Portal } from '@magento/venia-ui/lib/components/Portal';

import { useFilterModal } from './useFilterModal';

const FilterModal = ({ children }) => {
    const { formatMessage } = useIntl();
    const { isOpen, handleClose } = useFilterModal();
    const modalClass = isOpen ? classes.root_open : classes.root;

    const filtersAriaLabel = formatMessage({
        id: 'filterModal.filters.ariaLabel',
        defaultMessage: 'Filters'
    });

    const closeAriaLabel = formatMessage({
        id: 'filterModal.filters.close.ariaLabel',
        defaultMessage: 'Close filters popup.'
    });

    return (
        <Portal>
            {/* eslint-disable-next-line jsx-a11y/no-autofocus */}
            <FocusScope contain={true} restoreFocus={true} autoFocus={true}>
                <aside className={modalClass}>
                    <div className={classes.body}>
                        <div className={classes.header}>
                            <h2 className={classes.headerTitle}>
                                <FormattedMessage id="filterModal.headerTitles" defaultMessage="Filter" />
                            </h2>

                            <CircleButton onClick={handleClose} aria-disabled={false} aria-label={closeAriaLabel}>
                                <CloseIcon />
                            </CircleButton>
                        </div>
                        <ul className={classes.blocks} aria-label={filtersAriaLabel}>
                            <div className={classes.filterListContainer}>{children}</div>
                        </ul>
                    </div>
                    <FilterFooter
                        applyFilters={handleClose}
                        closeModal={handleClose}
                        isOpen={isOpen}
                        hasFilters={!!children}
                    />
                </aside>
            </FocusScope>
        </Portal>
    );
};

FilterModal.propTypes = {
    children: node
};

export default FilterModal;
