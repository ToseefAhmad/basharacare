import { bool, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import Checkbox from '@app/components/overrides/Checkbox';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './filterDefault.module.css';

const FilterDefault = ({ classes: propsClasses, isSelected, item, ...restProps }) => {
    const { label, value_index, count } = item || {};

    const classes = useStyle(defaultClasses, propsClasses);
    const { formatMessage } = useIntl();

    const ariaLabel = !isSelected
        ? formatMessage(
              {
                  id: 'filterModal.item.applyFilter',
                  defaultMessage: 'Apply filter "{optionName}".'
              },
              {
                  optionName: 'label'
              }
          )
        : formatMessage(
              {
                  id: 'filterModal.item.clearFilter',
                  defaultMessage: 'Remove filter "{optionName}".'
              },
              {
                  optionName: label
              }
          );

    return (
        <div className={classes.root}>
            <Checkbox
                field={`${label}-${value_index}`}
                fieldValue={!!isSelected}
                label={label}
                ariaLabel={ariaLabel}
                data-cy="FilterDefault-checkbox"
                {...restProps}
            />
            <span onClick={restProps.onMouseDown} onKeyDown={restProps.onKeyDown} tabIndex={0} role="button">
                ({count})
            </span>
        </div>
    );
};

export default FilterDefault;

FilterDefault.propTypes = {
    classes: shape({
        root: string,
        icon: string,
        label: string,
        checked: string
    }),
    group: string,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: string.isRequired
    }).isRequired,
    label: string
};
