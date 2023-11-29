import { Option as InformedOption, Select as InformedSelect, useFieldApi, useFieldState } from 'informed';
import { arrayOf, bool, node, number, oneOfType, shape, string } from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { ChevronDown as DropdownIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { FieldIcons, Message } from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './select.module.css';

const arrow = <Icon src={DropdownIcon} />;

const Select = props => {
    const { before, classes: propClasses, field, isOptional, items, message, setInitial, ...rest } = props;
    const fieldState = useFieldState(field);
    const fieldApi = useFieldApi(field);
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);
    const inputClass = fieldState.error ? classes.input_error : classes.input;

    useEffect(() => {
        // Set initial value if there's no value set or initial value is not one of the available options
        if (
            setInitial &&
            (!fieldState?.value || !items.find(item => item.value === fieldState.value)) &&
            items.length
        ) {
            fieldApi.setValue(items.filter(item => !!item.value)?.[0].value);
        }
    }, [fieldApi, fieldState, items, setInitial]);

    const options = items.map(({ disabled = null, hidden = null, label, value, key = value }) => (
        <InformedOption key={key} disabled={disabled} hidden={hidden} value={value}>
            {label || (value != null ? value : '')}{' '}
            {parseInt(value) === 0 &&
                isOptional &&
                formatMessage({
                    id: 'global.isOptional',
                    defaultMessage: '(optional)'
                })}
        </InformedOption>
    ));

    return (
        <Fragment>
            <FieldIcons classes={{ root: classes.fieldIconsRoot }} after={arrow} before={before}>
                <InformedSelect {...rest} className={inputClass} field={field}>
                    {options}
                </InformedSelect>
            </FieldIcons>
            <Message fieldState={fieldState}>{message}</Message>
        </Fragment>
    );
};

export default Select;

Select.propTypes = {
    before: node,
    classes: shape({
        input: string
    }),
    setInitial: bool,
    field: string.isRequired,
    items: arrayOf(
        shape({
            key: oneOfType([number, string]),
            label: string,
            value: oneOfType([number, string])
        })
    ),
    message: node
};
