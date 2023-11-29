import { Form } from 'informed';
import { func, shape, string, arrayOf } from 'prop-types';
import React, { Fragment, useRef } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import City from '@app/components/City/city';
import Button from '@app/components/overrides/Button';
import Field, { Message } from '@app/components/overrides/Field';
import TextInput from '@app/components/overrides/TextInput';
import { validatePhoneNumber } from '@app/util/formValidator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Country from '@magento/venia-ui/lib/components/Country';
import FormError from '@magento/venia-ui/lib/components/FormError';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './guestForm.module.css';
import { useGuestForm } from './useGuestForm';

const GuestForm = props => {
    const {
        afterSubmit,
        classes: propClasses,
        onCancel,
        onSuccess,
        shippingData,
        toggleSignInContent,
        setGuestSignInUsername,
        setShowSignin,
        setShowSignInToast
    } = props;
    const talonProps = useGuestForm({
        afterSubmit,
        onCancel,
        onSuccess,
        shippingData,
        toggleSignInContent,
        setGuestSignInUsername,
        setShowSignInToast,
        setShowSignin
    });
    const {
        errors,
        handleCancel,
        handleSubmit,
        initialValues,
        isSaving,
        isUpdate,
        handleValidateEmail,
        formData,
        setFormData,
        enableGuestFormSubmitButton
    } = talonProps;

    const formApiRef = useRef();
    const getFormApi = api => {
        formApiRef.current = api;
    };

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);

    const guestEmailMessage = !isUpdate ? (
        <Message>
            <FormattedMessage
                id="guestForm.emailMessage"
                defaultMessage="Set a password at the end of guest checkout to create an account in one easy step."
            />
        </Message>
    ) : null;

    const cancelButton = isUpdate ? (
        <Button disabled={isSaving} onClick={handleCancel} priority="low">
            <FormattedMessage id="global.cancel" defaultMessage="Cancel" />
        </Button>
    ) : null;

    const submitButtonText = isUpdate
        ? formatMessage({
              id: 'global.updateButton',
              defaultMessage: 'Update'
          })
        : formatMessage({
              id: 'guestForm.continueToNextStep',
              defaultMessage: 'Continue to Shipping Method'
          });

    const submitButtonProps = {
        disabled: isSaving || !enableGuestFormSubmitButton,
        priority: 'high',
        type: 'submit'
    };

    return (
        <Fragment>
            <FormError allowErrorMessages errors={Array.from(errors.values())} />
            <Form
                value={formData}
                onChange={formData => setFormData(formData)}
                className={classes.root}
                data-cy="GuestForm-root"
                initialValues={initialValues}
                onSubmit={handleSubmit}
                validateOnChange={true}
                getApi={getFormApi}
            >
                <div className={classes.email}>
                    <Field
                        id="email"
                        label={formatMessage({
                            id: 'global.email',
                            defaultMessage: 'Email'
                        })}
                    >
                        <TextInput
                            validateOnChange
                            classes={{ input: classes.textInput }}
                            autoComplete="off"
                            field="email"
                            id="email"
                            data-cy="GuestForm-email"
                            validate={isRequired}
                            onBlur={() => handleValidateEmail(formApiRef.current.getValue('email'))}
                            onPaste={e => {
                                const text = e.clipboardData.getData('text/plain');
                                handleValidateEmail(text);
                            }}
                        />
                        {guestEmailMessage}
                    </Field>
                </div>
                <div className={classes.firstname}>
                    <Field
                        id="firstname"
                        label={formatMessage({
                            id: 'global.firstName',
                            defaultMessage: 'First Name'
                        })}
                    >
                        <TextInput
                            validateOnChange
                            classes={{ input: classes.textInput }}
                            field="firstname"
                            id="firstname"
                            data-cy="GuestForm-firstName"
                            validate={isRequired}
                        />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field
                        id="lastname"
                        label={formatMessage({
                            id: 'global.lastName',
                            defaultMessage: 'Last Name'
                        })}
                    >
                        <TextInput
                            validateOnChange
                            classes={{ input: classes.textInput }}
                            field="lastname"
                            id="lastname"
                            data-cy="GuestForm-lastName"
                            validate={isRequired}
                        />
                    </Field>
                </div>
                <div className={classes.country}>
                    <Country
                        classes={{ root: classes.countryRoot }}
                        validate={isRequired}
                        data-cy="GuestForm-country"
                    />
                </div>
                <div className={classes.street0}>
                    <Field
                        id="street0"
                        label={formatMessage({
                            id: 'global.streetAddress',
                            defaultMessage: 'Street Address'
                        })}
                    >
                        <TextInput
                            validateOnChange
                            classes={{ input: classes.textInput }}
                            field="street[0]"
                            id="street0"
                            data-cy="GuestForm-street0"
                            validate={isRequired}
                        />
                    </Field>
                </div>
                <div className={classes.street1}>
                    <Field
                        id="street1"
                        label={formatMessage({
                            id: 'global.streetAddress2',
                            defaultMessage: 'Street Address 2'
                        })}
                        optional={true}
                    >
                        <TextInput
                            validateOnChange
                            classes={{ input: classes.textInput }}
                            field="street[1]"
                            id="street1"
                            data-cy="GuestForm-street1"
                        />
                    </Field>
                </div>
                <div className={classes.city}>
                    <City
                        validateOnChange
                        classes={{ input: classes.textInput }}
                        selectClasses={{ root: classes.cityRoot, input: classes.cityInput }}
                        field="city"
                        countryField="country"
                        id="city"
                        data-cy="GuestForm-city"
                        validate={isRequired}
                        setInitial
                    />
                </div>
                <div className={classes.telephone}>
                    <Field
                        id="telephone"
                        label={formatMessage({
                            id: 'global.phoneNumber',
                            defaultMessage: 'Phone Number'
                        })}
                    >
                        <TextInput
                            validateOnBlur={true}
                            classes={{ input: classes.textInput }}
                            field="telephone"
                            id="telephone"
                            isRequired={true}
                            validate={combine([isRequired, validatePhoneNumber])}
                        />
                    </Field>
                </div>
                <div className={classes.buttons}>
                    {cancelButton}
                    <Button {...submitButtonProps} data-cy="GuestForm-submitButton">
                        {submitButtonText}
                    </Button>
                </div>
            </Form>
        </Fragment>
    );
};

export default GuestForm;

GuestForm.propTypes = {
    afterSubmit: func,
    classes: shape({
        root: string,
        field: string,
        email: string,
        firstname: string,
        lastname: string,
        country: string,
        street0: string,
        street1: string,
        city: string,
        postcode: string,
        telephone: string,
        buttons: string,
        submit: string,
        submit_update: string
    }),
    onCancel: func,
    onSuccess: func.isRequired,
    shippingData: shape({
        city: string,
        country: shape({
            code: string.isRequired
        }).isRequired,
        email: string,
        firstname: string,
        lastname: string,
        postcode: string,
        street: arrayOf(string),
        telephone: string
    }),
    toggleSignInContent: func.isRequired,
    setGuestSignInUsername: func.isRequired
};
