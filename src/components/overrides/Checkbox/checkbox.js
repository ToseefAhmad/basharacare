import classNames from 'classnames';
import { Checkbox as InformedCheckbox, useFieldApi } from 'informed';
import { node, shape, string } from 'prop-types';
import React, { Fragment, useEffect } from 'react';

import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';

import defaultClasses from './checkbox.module.css';

const checkedIcon = (
    <svg width="10" height="7" viewBox="0 0 10 7" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.6602 0.425781L3.79665 5.28933L1.88063 3.37331L1.23047 4.02348L3.79665 6.58966L9.31036 1.07595L8.6602 0.425781Z"
            fill="currentColor"
            stroke="currentColor"
            strokeWidth="0.5"
        />
    </svg>
);

const Checkbox = ({
    ariaLabel,
    classes: propClasses,
    field,
    defaultChecked,
    rootRef,
    children,
    fieldValue,
    id,
    label,
    message,
    disabled,
    ...rest
}) => {
    const fieldApi = useFieldApi(field);
    const fieldState = useFieldState(field);
    const classes = useStyle(defaultClasses, propClasses);
    const icon = fieldState.value ? checkedIcon : null;

    useEffect(() => {
        if (fieldValue != null && fieldValue !== fieldState.value) {
            fieldApi.setValue(fieldValue);
        }
    }, [fieldApi, fieldState.value, fieldValue]);

    // Separate UseEffect to only set value on first render and  when default check enabled
    useEffect(() => {
        if (defaultChecked) {
            fieldApi.setValue(true);
        }
    }, [defaultChecked, fieldApi]);

    return (
        <Fragment>
            <label
                ref={rootRef}
                aria-label={ariaLabel}
                className={classNames(classes.root, {
                    [classes.disabled]: disabled
                })}
                htmlFor={id}
            >
                <InformedCheckbox {...rest} disabled={disabled} className={classes.input} field={field} id={id} />
                <span className={classes.icon}>{icon}</span>
                <span
                    onClick={rest.onMouseDown}
                    onKeyDown={rest.onKeyDown}
                    tabIndex={0}
                    role="button"
                    className={classes.label}
                >
                    {label}
                </span>
                {children}
            </label>
            <Message
                fieldState={fieldState}
                classes={{
                    root_error: classes.errorMsg
                }}
            >
                {message}
            </Message>
        </Fragment>
    );
};

export default Checkbox;

Checkbox.propTypes = {
    ariaLabel: string,
    classes: shape({
        icon: string,
        input: string,
        label: string,
        message: string,
        root: string
    }),
    field: string.isRequired,
    id: string,
    label: node.isRequired,
    message: node
};
