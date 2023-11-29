import { RadioGroup as InformedRadioGroup } from 'informed';
import { arrayOf, number, node, oneOfType, shape, string } from 'prop-types';
import React, { Fragment } from 'react';

import { Message } from '@app/components/overrides/Field';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Radio from './radio';
import defaultClasses from './radioGroup.module.css';

const RadioGroup = props => {
    const { children, classes: propClasses, disabled, field, id, items, message, onOptionChange, ...rest } = props;
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);

    const options =
        children ||
        items.map(({ value, title, label }) => {
            return (
                <div key={value}>
                    <div className={classes.shippingCondition}> {title}</div>
                    <Radio
                        data-cy=""
                        disabled={disabled}
                        label={label}
                        classes={{
                            label: classes.radioLabel,
                            root: classes.radioContainer
                        }}
                        id={`${field}--${value}`}
                        value={value}
                        onChange={onOptionChange}
                    />
                </div>
            );
        });

    return (
        <Fragment>
            <div data-cy="RadioGroup-root" className={classes.root}>
                <InformedRadioGroup {...rest} field={field} id={id}>
                    {options}
                </InformedRadioGroup>
            </div>
            <Message className={classes.message} fieldState={fieldState}>
                {message}
            </Message>
        </Fragment>
    );
};

export default RadioGroup;

RadioGroup.propTypes = {
    children: node,
    classes: shape({
        message: string,
        radioContainer: string,
        radioLabel: string,
        root: string
    }),
    field: string.isRequired,
    id: string,
    items: arrayOf(
        shape({
            key: oneOfType([number, string]),
            label: node,
            value: oneOfType([number, string])
        })
    ),
    message: node
};
