import { Form } from 'informed';
import { func, shape, string, bool, number } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import DateInput from '@app/components/DateInput';
import Button from '@app/components/overrides/Button';
import Checkbox from '@app/components/overrides/Checkbox';
import FormError from '@app/components/overrides/FormError';
import Select from '@app/components/overrides/Select';
import TextInput from '@app/components/overrides/TextInput';
import { isEmail } from '@app/util/formValidator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Password from '@magento/venia-ui/lib/components/Password';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { hasLengthAtLeast, isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './createAccount.module.css';
import { useCreateAccount } from './useCreateAccount.js';

const CreateAccount = props => {
    const talonProps = useCreateAccount({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel
    });

    const { errors, handleCancel, handleSubmit, isDisabled, initialValues } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const genderValues = [
        {
            key: '0',
            value: '0',
            label: formatMessage({
                id: 'createAccount.genderSelectLabel',
                defaultMessage: 'Gender'
            })
        },
        {
            key: '1',
            value: '1',
            label: formatMessage({
                id: 'createAccount.maleLabel',
                defaultMessage: 'Male'
            })
        },
        {
            key: '2',
            value: '2',
            label: formatMessage({
                id: 'createAccount.femaleLabel',
                defaultMessage: 'Female'
            })
        }
    ];

    const cancelButton = props.isCancelButtonHidden ? null : (
        <Button
            className={classes.cancelButton}
            disabled={isDisabled}
            type="button"
            priority="low"
            onClick={handleCancel}
        >
            <FormattedMessage id="global.cancel" defaultMessage="Cancel" />
        </Button>
    );

    const submitButton = (
        <Button
            className={classes.submitButton}
            disabled={isDisabled}
            type="submit"
            priority="high"
            data-cy="CreateAccount-submitButton"
        >
            <FormattedMessage id="createAccount.createAccountText" defaultMessage="Create an Account" />
        </Button>
    );

    return (
        <Form className={classes.formRoot} initialValues={initialValues} onSubmit={handleSubmit}>
            <h2 className={classes.title}>
                <FormattedMessage id="createAccount.createAccountText" defaultMessage="Create an Account" />
            </h2>
            <FormError errors={Array.from(errors.values())} allowErrorMessages={true} />
            <TextInput
                field="customer.firstname"
                autoComplete="given-name"
                validate={isRequired}
                validateOnBlur
                label={formatMessage({
                    id: 'global.firstName',
                    defaultMessage: 'First Name'
                })}
                mask={value => value && value.trim()}
                maskOnBlur={true}
                data-cy="customer-firstname"
            />
            <TextInput
                field="customer.lastname"
                autoComplete="family-name"
                validate={isRequired}
                validateOnBlur
                label={formatMessage({
                    id: 'global.lastName',
                    defaultMessage: 'Last Name'
                })}
                mask={value => value && value.trim()}
                maskOnBlur={true}
                data-cy="customer-lastname"
            />
            <TextInput
                field="customer.email"
                autoComplete="email"
                isRequired={true}
                validate={combine([isEmail, isRequired])}
                validateOnBlur
                mask={value => value && value.trim()}
                maskOnBlur={true}
                label={formatMessage({
                    id: 'createAccount.emailText',
                    defaultMessage: 'Email'
                })}
                data-cy="customer-email"
            />
            <DateInput
                isOptional={true}
                field="customer.dateOfBirth"
                label={formatMessage({
                    id: 'createAccount.dateOfBirthLabelPlaceholder',
                    defaultMessage: 'Date Of Birth'
                })}
            />

            <span className={classes.selectField}>
                <Select field="customer.gender" items={genderValues} isOptional={true} />
            </span>

            <Password
                autoComplete="new-password"
                fieldName="password"
                isToggleButtonHidden={false}
                label={formatMessage({
                    id: 'createAccount.passwordText',
                    defaultMessage: 'Password'
                })}
                validate={combine([isRequired, [hasLengthAtLeast, 8]])}
                validateOnBlur
                mask={value => value && value.trim()}
                maskOnBlur={true}
                data-cy="password"
            />
            <div className={classes.subscribe}>
                <Checkbox
                    field="subscribe"
                    id="subscribe"
                    defaultChecked={true}
                    label={formatMessage({
                        id: 'createAccount.subscribeText',
                        defaultMessage: 'Subscribe to Newsletters'
                    })}
                />
            </div>
            <div className={classes.actions}>
                {submitButton}
                {cancelButton}
            </div>
        </Form>
    );
};

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        lead: string,
        root: string,
        subscribe: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string,
        dateOfBirth: string,
        gender: number
    }),
    isCancelButtonHidden: bool,
    onSubmit: func,
    onCancel: func
};

CreateAccount.defaultProps = {
    onCancel: () => {},
    isCancelButtonHidden: true
};

export default CreateAccount;
