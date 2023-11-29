import classnames from 'classnames';
import { asField, useFieldApi } from 'informed';
import { node, shape, string, bool } from 'prop-types';
import React, { Fragment } from 'react';
import { Calendar } from 'react-feather';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import { FieldIcons, Message } from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { isRequired as isRequiredFunc } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './dateInput.module.css';

const DataInputContent = asField(
    ({ before, fieldState, classes: propClasses, field, isOptional, message, isRequiredField, label, isGrey }) => {
        const classes = useStyle(defaultClasses, propClasses);
        const { formatMessage } = useIntl();
        const inputClass = fieldState.error ? classes.input_error : classes.input;
        const fieldApi = useFieldApi(field);
        const dataPickerIcon = (
            <div className={isGrey ? classes.iconGrey : classes.icon}>
                <Icon src={Calendar} />
            </div>
        );

        const onDataChange = value => {
            if (value && fieldApi != null) {
                fieldApi.setValue(value);
            }
        };

        return (
            <Fragment>
                <FieldIcons
                    classes={{ root: classes.fieldRoot, input: classes.inputRoot, after: classes.after }}
                    after={dataPickerIcon}
                    before={before}
                >
                    <input
                        className={inputClass}
                        type="date"
                        placeholder={label}
                        onChange={e => onDataChange(e.target.value)}
                    />
                    <span
                        className={classnames(!isGrey ? classes.dateLabel : classes.dateLabelGrey, {
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

const DataInput = ({ validate, isRequired, isGrey, ...rest }) => {
    const isRequiredField = (!!validate && validate === isRequiredFunc) || isRequired;

    return (
        <>
            <DataInputContent {...rest} validate={validate} isGrey={isGrey} isRequiredField={isRequiredField} />
        </>
    );
};

export default DataInput;

DataInput.propTypes = {
    after: node,
    before: node,
    classes: shape({
        input: string
    }),
    isOptional: bool,
    field: string.isRequired,
    message: node,
    isRequired: bool,
    isGrey: bool
};
