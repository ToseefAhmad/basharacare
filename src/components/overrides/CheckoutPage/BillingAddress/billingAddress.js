import { shape, string, func, bool } from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import { useBillingAddress } from '@magento/peregrine/lib/talons/CheckoutPage/BillingAddress/useBillingAddress';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Country from '@magento/venia-ui/lib/components/Country';
import Field from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './billingAddress.module.css';

const BillingAddress = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { isBillingAddressSame, initialValues, shippingAddressCountry, errors } = useBillingAddress(props);

    const { formatMessage } = useIntl();

    /**
     * Instead of defining classes={root: classes.FIELD_NAME}
     */
    const fieldClasses = useMemo(() => {
        return ['first_name', 'last_name', 'country', 'street1', 'street2', 'city', 'phone_number'].reduce(
            (acc, fieldName) => {
                acc[fieldName] = { root: classes[fieldName] };

                return acc;
            },
            {}
        );
    }, [classes]);

    /**
     * These 2 functions are wrappers around the `isRequired` function
     * of `formValidators`. They perform validations only if the
     * billing address is different from shipping address.
     */
    const isFieldRequired = useCallback((value, { isBillingAddressSame }) => {
        if (isBillingAddressSame) {
            /**
             * Informed validator functions return `undefined` if
             * validation is `true`
             */
            return undefined;
        } else {
            return isRequired(value);
        }
    }, []);

    const billingAddressFieldsClassName = isBillingAddressSame
        ? classes.billing_address_fields_root_hidden
        : classes.billing_address_fields_root;

    return (
        <div>
            <FormError classes={{ root: classes.formErrorContainer }} errors={Array.from(errors.values())} />
            <div className={classes.address_check}>
                <Checkbox
                    field="isBillingAddressSame"
                    label={formatMessage({
                        id: 'checkoutPage.billingAddressSame',
                        defaultMessage: 'Billing address same as shipping address'
                    })}
                    initialValue={initialValues.isBillingAddressSame}
                />
            </div>
            <div className={billingAddressFieldsClassName}>
                <Field
                    id="firstName"
                    classes={fieldClasses.first_name}
                    label={formatMessage({
                        id: 'global.firstName',
                        defaultMessage: 'First Name'
                    })}
                >
                    <TextInput
                        validateOnChange
                        id="firstName"
                        field="firstName"
                        validate={isFieldRequired}
                        initialValue={initialValues.firstName}
                        isRequired
                    />
                </Field>
                <Field
                    id="lastName"
                    classes={fieldClasses.last_name}
                    label={formatMessage({
                        id: 'global.lastName',
                        defaultMessage: 'Last Name'
                    })}
                >
                    <TextInput
                        isRequired
                        validateOnChange
                        id="lastName"
                        field="lastName"
                        validate={isFieldRequired}
                        initialValue={initialValues.lastName}
                    />
                </Field>
                <Country
                    classes={fieldClasses.country}
                    validateOnChange
                    validate={isFieldRequired}
                    initialValue={
                        /**
                         * If there is no initial value to start with
                         * use the country from shipping address.
                         */
                        initialValues.country || shippingAddressCountry
                    }
                />
                <Field
                    id="street1"
                    classes={fieldClasses.street1}
                    label={formatMessage({
                        id: 'global.streetAddress',
                        defaultMessage: 'Street Address'
                    })}
                >
                    <TextInput
                        isRequired
                        validateOnChange
                        id="street1"
                        field="street1"
                        validate={isFieldRequired}
                        initialValue={initialValues.street1}
                    />
                </Field>
                <Field
                    id="street2"
                    classes={fieldClasses.street2}
                    label={formatMessage({
                        id: 'global.streetAddress2',
                        defaultMessage: 'Street Address 2'
                    })}
                    optional={true}
                >
                    <TextInput id="street2" field="street2" initialValue={initialValues.street2} />
                </Field>
                <Field
                    id="city"
                    classes={fieldClasses.city}
                    label={formatMessage({
                        id: 'global.city',
                        defaultMessage: 'City'
                    })}
                >
                    <TextInput
                        isRequired
                        validateOnChange
                        id="city"
                        field="city"
                        validate={isFieldRequired}
                        initialValue={initialValues.city}
                    />
                </Field>

                <Field
                    id="phoneNumber"
                    classes={fieldClasses.phone_number}
                    label={formatMessage({
                        id: 'global.phoneNumber',
                        defaultMessage: 'Phone Number'
                    })}
                >
                    <TextInput
                        isRequired
                        validateOnChange
                        id="phoneNumber"
                        field="phoneNumber"
                        validate={isFieldRequired}
                        initialValue={initialValues.phoneNumber}
                    />
                </Field>
            </div>
        </div>
    );
};

BillingAddress.propTypes = {
    classes: shape({ root: string }),
    shouldSubmit: bool.isRequired,
    onBillingAddressChangedError: func,
    onBillingAddressChangedSuccess: func
};

export default BillingAddress;
