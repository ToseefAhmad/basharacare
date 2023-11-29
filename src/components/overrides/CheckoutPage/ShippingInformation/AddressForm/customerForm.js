import { Form, Text } from 'informed';
import { arrayOf, bool, func, number, shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import City from '@app/components/City/city';
import Button from '@app/components/overrides/Button';
import Checkbox from '@app/components/overrides/Checkbox';
import Field, { Message } from '@app/components/overrides/Field';
import TextInput from '@app/components/overrides/TextInput';
import { validatePhoneNumber } from '@app/util/formValidator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Country from '@magento/venia-ui/lib/components/Country';
import FormError from '@magento/venia-ui/lib/components/FormError';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './customerForm.module.css';
import { useCustomerForm } from './useCustomerForm';

const CustomerForm = props => {
    const { afterSubmit, classes: propClasses, onCancel, onSuccess, shippingData } = props;

    const talonProps = useCustomerForm({
        afterSubmit,
        onCancel,
        onSuccess,
        shippingData
    });
    const {
        errors,
        handleCancel,
        handleSubmit,
        hasDefaultShipping,
        initialValues,
        isLoading,
        isSaving,
        isUpdate
    } = talonProps;
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id="customerForm.loading" defaultMessage="Fetching Customer Details..." />
            </LoadingIndicator>
        );
    }

    const emailRow = !hasDefaultShipping ? (
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
                    disabled={true}
                    field="email"
                    id="email"
                    validate={isRequired}
                />
            </Field>
        </div>
    ) : null;

    const formMessageRow = !hasDefaultShipping ? (
        <div className={classes.formMessage}>
            <Message>
                <FormattedMessage
                    id="customerForm.formMessage"
                    defaultMessage="The shipping address you enter will be saved to your address book and set as your default for future purchases."
                />
            </Message>
        </div>
    ) : null;

    const cancelButton = isUpdate ? (
        <Button disabled={isSaving} onClick={handleCancel} priority="low">
            <FormattedMessage id="global.cancel" defaultMessage="Cancel" />
        </Button>
    ) : null;

    const submitButtonText = !hasDefaultShipping
        ? formatMessage({
              id: 'global.saveAndContinueButton',
              defaultMessage: 'Save and Continue'
          })
        : isUpdate
        ? formatMessage({
              id: 'global.updateButton',
              defaultMessage: 'Update'
          })
        : formatMessage({
              id: 'global.addButton',
              defaultMessage: 'Add'
          });
    const submitButtonProps = {
        disabled: isSaving,
        priority: !hasDefaultShipping ? 'normal' : 'high',
        type: 'submit'
    };

    const defaultShippingElement = hasDefaultShipping ? (
        <div className={classes.defaultShipping}>
            <Checkbox
                disabled={!!initialValues.default_shipping}
                id="default_shipping"
                data-cy="CustomerForm-defaultShipping"
                field="default_shipping"
                label={formatMessage({
                    id: 'customerForm.defaultShipping',
                    defaultMessage: 'Make this my default address'
                })}
            />
        </div>
    ) : (
        <Text type="hidden" field="default_shipping" initialValue={true} />
    );

    return (
        <Fragment>
            <FormError allowErrorMessages errors={Array.from(errors.values())} />
            <Form
                className={classes.root}
                data-cy="CustomerForm-root"
                initialValues={initialValues}
                onSubmit={handleSubmit}
            >
                {formMessageRow}
                {emailRow}
                <div className={classes.firstname}>
                    <Field
                        id="customer_firstname"
                        label={formatMessage({
                            id: 'global.firstName',
                            defaultMessage: 'First Name'
                        })}
                    >
                        <TextInput
                            validateOnChange
                            classes={{ input: classes.textInput }}
                            disabled={!hasDefaultShipping}
                            field="firstname"
                            id="customer_firstname"
                            data-cy="CustomerForm-firstName"
                            validate={isRequired}
                        />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field
                        id="customer_lastname"
                        label={formatMessage({
                            id: 'global.lastName',
                            defaultMessage: 'Last Name'
                        })}
                    >
                        <TextInput
                            validateOnChange
                            classes={{ input: classes.textInput }}
                            disabled={!hasDefaultShipping}
                            field="lastname"
                            id="customer_lastname"
                            data-cy="CustomerForm-lastName"
                            validate={isRequired}
                        />
                    </Field>
                </div>
                <div className={classes.country}>
                    <Country
                        classes={{ root: classes.countryRoot }}
                        validate={isRequired}
                        data-cy="CustomerForm-country"
                    />
                </div>
                <div className={classes.street0}>
                    <Field
                        id="customer_street0"
                        label={formatMessage({
                            id: 'global.streetAddress',
                            defaultMessage: 'Street Address'
                        })}
                    >
                        <TextInput
                            validateOnChange
                            classes={{ input: classes.textInput }}
                            field="street[0]"
                            validate={isRequired}
                            id="customer_street0"
                            data-cy="CustomerForm-street0"
                        />
                    </Field>
                </div>
                <div className={classes.street1}>
                    <Field
                        id="customer_street1"
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
                            id="customer_street1"
                            data-cy="CustomerForm-street1"
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
                        id="customer_telephone"
                        label={formatMessage({
                            id: 'global.phoneNumber',
                            defaultMessage: 'Phone Number'
                        })}
                    >
                        <TextInput
                            isRequired={true}
                            validateOnChange
                            classes={{ input: classes.textInput }}
                            field="telephone"
                            validate={combine([isRequired, validatePhoneNumber])}
                            id="customer_telephone"
                            data-cy="CustomerForm-telephone"
                        />
                    </Field>
                </div>
                {defaultShippingElement}
                <div className={classes.buttons}>
                    {cancelButton}
                    <Button {...submitButtonProps} data-cy="CustomerForm-submitButton">
                        {submitButtonText}
                    </Button>
                </div>
            </Form>
        </Fragment>
    );
};

export default CustomerForm;

CustomerForm.propTypes = {
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
        formMessage: string,
        defaultShipping: string
    }),
    onCancel: func,
    shippingData: shape({
        city: string,
        country: shape({
            code: string.isRequired
        }).isRequired,
        default_shipping: bool,
        email: string,
        firstname: string,
        id: number,
        lastname: string,
        street: arrayOf(string),
        telephone: string
    })
};
