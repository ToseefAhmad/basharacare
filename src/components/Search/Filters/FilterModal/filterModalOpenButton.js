import { shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Sort } from '@app/components/Icons';
import Button from '@app/components/overrides/Button';
import defaultClasses from '@app/components/overrides/FilterModalOpenButton/filterModalOpenButton.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';

import { useFilterModal } from './useFilterModal';

const FilterModalOpenButton = ({ classes: propClasses }) => {
    const { handleOpen } = useFilterModal();

    const classes = useStyle(defaultClasses, propClasses);

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
FilterModalOpenButton.propTypes = {
    classes: shape({
        filterButton: string
    })
};

export default FilterModalOpenButton;
