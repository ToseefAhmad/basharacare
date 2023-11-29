import { Form } from 'informed';
import { func, shape, string, bool, number } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import DateInput from '@app/components/DateInput';
import Button from '@app/components/overrides/Button';
import Checkbox from '@app/components/overrides/Checkbox';
import { useCreateAccount } from '@app/components/overrides/CreateAccount/useCreateAccount';
import FormError from '@app/components/overrides/FormError';
import Select from '@app/components/overrides/Select';
import TextInput from '@app/components/overrides/TextInput';
import { isEmail } from '@app/util/formValidator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Password from '@magento/venia-ui/lib/components/Password';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { hasLengthAtLeast, isEqualToField, isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './createAccount.module.css';
const CreateAccount = props => {
    const talonProps = useCreateAccount({
        initialValues: props.initialValues,
        onSubmit: props.onSubmit,
        onCancel: props.onCancel
    });

    const { errors, handleSubmit, isDisabled, initialValues } = talonProps;
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
        <>
            <Form className={classes.root} initialValues={initialValues} onSubmit={handleSubmit}>
                <div className={classes.title} data-cy="AccountInformationPage-title">
                    <h3>
                        <FormattedMessage id="createAccount.personalInformationTitle" defaultMessage="Personal" />
                    </h3>
                    <h3>
                        <FormattedMessage
                            id="createAccount.personalInformationTitleSecondary"
                            defaultMessage="Information"
                        />
                    </h3>
                </div>
                <FormError errors={Array.from(errors.values())} allowErrorMessages={true} />
                <div className={classes.nameWrapper}>
                    <TextInput
                        label={formatMessage({
                            id: 'global.firstName',
                            defaultMessage: 'First Name'
                        })}
                        field="customer.firstname"
                        autoComplete="given-name"
                        validate={isRequired}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="customer-firstname"
                    />
                </div>
                <div className={classes.lastNameWrapper}>
                    <TextInput
                        field="customer.lastname"
                        label={formatMessage({
                            id: 'global.lastName',
                            defaultMessage: 'Last Name'
                        })}
                        autoComplete="family-name"
                        validate={isRequired}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="customer-lastname"
                    />
                </div>
                <div className={classes.subscribe}>
                    <Checkbox
                        defaultChecked={true}
                        field="subscribe"
                        id="subscribe"
                        label={formatMessage({
                            id: 'createAccount.subscribeText',
                            defaultMessage: 'Subscribe to Newsletters'
                        })}
                    />
                </div>
                <div className={classes.dobWrapper}>
                    <DateInput
                        label={formatMessage({
                            id: 'createAccount.dateOfBirthLabelPlaceholder',
                            defaultMessage: 'Date Of Birth'
                        })}
                        isOptional={true}
                        field="customer.dateOfBirth"
                        id="date"
                        isGrey
                    />
                </div>
                <span className={classes.genderWrapper}>
                    <Select field="customer.gender" items={genderValues} isOptional={true} />
                </span>

                <div className={classes.title} data-cy="AccountInformationPage-title">
                    <h3>
                        <FormattedMessage id="createAccount.signInInformationTitle" defaultMessage="Sign-in" />
                    </h3>
                    <h3>
                        <FormattedMessage
                            id="createAccount.signInInformationTitleSecondary"
                            defaultMessage="Information"
                        />
                    </h3>
                </div>

                <div className={classes.emailWrapper}>
                    <TextInput
                        field="customer.email"
                        autoComplete="email"
                        label={formatMessage({
                            id: 'global.email',
                            defaultMessage: 'Email'
                        })}
                        isRequired={true}
                        validate={combine([isEmail, isRequired])}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="customer-email"
                    />
                </div>
                <div className={classes.passwordWrapper}>
                    <Password
                        id="password"
                        autoComplete="new-password"
                        label={formatMessage({
                            id: 'global.password',
                            defaultMessage: 'Password'
                        })}
                        fieldName="password"
                        isToggleButtonHidden={false}
                        isRequired={true}
                        validate={combine([isRequired, [hasLengthAtLeast, 8]])}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="password"
                    />
                </div>
                <div className={classes.confirmPasswordWrapper}>
                    <Password
                        autoComplete="new-password"
                        label={formatMessage({
                            id: 'createAccount.firstNamePlaceholder',
                            defaultMessage: 'Confirm Password'
                        })}
                        isRequired={true}
                        fieldName="confirm-password"
                        isToggleButtonHidden={false}
                        validate={combine([isRequired, [hasLengthAtLeast, 8], [isEqualToField, 'password']])}
                        validateOnBlur
                        mask={value => value && value.trim()}
                        maskOnBlur={true}
                        data-cy="password"
                    />
                </div>

                <div className={classes.submitButtonWrapper}>{submitButton}</div>
            </Form>
            <div className={classes.actions}>
                <p className={classes.requiredFieldsText}>
                    <FormattedMessage id="createAccount.requiredFieldsText" defaultMessage="* Required Fields" />
                </p>
                <Link className={classes.backButton} to="/sign-in">
                    <FormattedMessage id="createAccount.backText" defaultMessage="Go back" />
                </Link>
            </div>
        </>
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
