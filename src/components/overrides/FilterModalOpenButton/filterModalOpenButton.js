import { shape, string, array } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Sort } from '@app/components/Icons';
import Button from '@app/components/overrides/Button';
import { useFilterModal } from '@magento/peregrine/lib/talons/FilterModal/useFilterModal';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './filterModalOpenButton.module.css';

const FilterModalOpenButton = props => {
    const { filters, classes: propsClasses, searchFilters } = props;
    const classes = useStyle(defaultClasses, propsClasses);
    const { handleOpen } = useFilterModal({ filters, searchFilters });

    return (
        <Button
            priority="normal"
            classes={{
                root_normalPriority: classes.filterButton
            }}
            data-cy="FilterModalOpenButton-button"
            onClick={handleOpen}
            type="button"
            aria-live="polite"
            aria-busy="false"
        >
            <Sort />
            <FormattedMessage id="productList.filter" defaultMessage="Filter" />
        </Button>
    );
};

export default FilterModalOpenButton;

FilterModalOpenButton.propTypes = {
    classes: shape({
        filterButton: string
    }),
    filters: array
};
