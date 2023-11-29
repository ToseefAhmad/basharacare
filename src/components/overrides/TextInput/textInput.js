import classnames from 'classnames';
import { BasicText as InformedText, asField } from 'informed';
import { node, shape, string, bool } from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { FieldIcons, Message } from '@magento/venia-ui/lib/components/Field';
import { isRequired as isRequiredFunc } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './textInput.module.css';

const TextInputContent = asField(
    ({
        after,
        before,
        fieldState,
        classes: propClasses,
        field,
        isOptional,
        message,
        isRequiredField,
        label,
        ...rest
    }) => {
        const classes = useStyle(defaultClasses, propClasses);
        const { formatMessage } = useIntl();
        const inputClass = fieldState.error ? classes.input_error : classes.input;

        return (
            <Fragment>
                <FieldIcons
                    classes={{ root: classes.fieldRoot, input: classes.inputRoot }}
                    after={after}
                    before={before}
                >
                    <InformedText
                        fieldState={fieldState}
                        className={inputClass}
                        field={field}
                        placeholder={label}
                        {...rest}
                    />
                    <span
                        className={classnames(classes.label, {
                            [classes.hidden]: !!fieldState.value
                        })}
                    >
                        {label}{' '}
                        {isOptional &&
                            formatMessage({
                                id: 'global.isOptional',
                                defaultMessage: '(optional)'
                            })}
                    </span>
                    <span
                        className={classnames(classes.isRequired, {
                            [classes.hidden]: !isRequiredField
                        })}
                    />
                </FieldIcons>
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
    }
);

const TextInput = ({ validate, type, isRequired, ...rest }) => {
    const isRequiredField = (!!validate && validate === isRequiredFunc) || isRequired;

    return <TextInputContent {...rest} type={type} validate={validate} isRequiredField={isRequiredField} />;
};

export default TextInput;

TextInput.propTypes = {
    after: node,
    before: node,
    classes: shape({
        input: string
    }),
    type: string,
    isOptional: bool,
    field: string.isRequired,
    message: node,
    isRequired: bool
};
