import { bool, func, object, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import City from '@app/components/City/city';
import { useDefaultCountry } from '@app/hooks/useDefaultCountry/useDefaultCountry';
import { validatePhoneNumber } from '@app/util/formValidator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Country from '@magento/venia-ui/lib/components/Country';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import Field from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './addEditDialog.module.css';

const AddEditDialog = props => {
    const { formErrors, formProps, isBusy, isEditMode, isOpen, onCancel, onConfirm, isAddressesExist } = props;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);
    const { initialValues } = formProps;
    const { defaultCountry } = useDefaultCountry();

    const title = isEditMode
        ? formatMessage({
              id: 'addressBookPage.editDialogTitle',
              defaultMessage: 'Edit Address'
          })
        : formatMessage({
              id: 'addressBookPage.addDialogTitle',
              defaultMessage: 'New Address'
          });

    const firstNameLabel = formatMessage({
        id: 'global.firstName',
        defaultMessage: 'First Name'
    });
    const middleNameLabel = formatMessage({
        id: 'global.middleName',
        defaultMessage: 'Middle Name'
    });
    const lastNameLabel = formatMessage({
        id: 'global.lastName',
        defaultMessage: 'Last Name'
    });
    const street1Label = formatMessage({
        id: 'global.streetAddress',
        defaultMessage: 'Street Address'
    });
    const street2Label = formatMessage({
        id: 'global.streetAddress2',
        defaultMessage: 'Street Address 2'
    });
    const telephoneLabel = formatMessage({
        id: 'global.phoneNumber',
        defaultMessage: 'Phone Number'
    });
    const defaultBillingAddressCheckLabel = formatMessage({
        id: 'addressBookPage.makeDefaultBillingAddress',
        defaultMessage: 'Make this my default billing address'
    });

    const defaultShippingAddressCheckLabel = formatMessage({
        id: 'addressBookPage.makeDefaultShippingAddress',
        defaultMessage: 'Make this my default shipping address'
    });

    const defaultAdressesCheckboxes = isAddressesExist ? (
        <div className={classes.default_address_check}>
            <Checkbox field="default_shipping" label={defaultShippingAddressCheckLabel} data-cy="default_shipping" />
            <Checkbox field="default_billing" label={defaultBillingAddressCheckLabel} data-cy="default_billing" />
        </div>
    ) : null;

    const defaultCountryValue = initialValues.country_code ? initialValues.country_code : defaultCountry;
    return (
        <Dialog
            confirmTranslationId="global.save"
            confirmText="Save"
            formProps={formProps}
            isOpen={isOpen}
            onCancel={onCancel}
            onConfirm={onConfirm}
            shouldDisableAllButtons={isBusy}
            title={title}
        >
            <FormError classes={{ root: classes.errorContainer }} errors={Array.from(formErrors.values())} />
            <div className={classes.root} data-cy="AddEditDialog-root">
                <div className={classes.firstname}>
                    <Field id="firstname" label={firstNameLabel}>
                        <TextInput field="firstname" validate={isRequired} data-cy="firstname" />
                    </Field>
                </div>
                <div className={classes.middlename}>
                    <Field id="middlename" label={middleNameLabel} optional={true}>
                        <TextInput field="middlename" data-cy="middlename" />
                    </Field>
                </div>
                <div className={classes.lastname}>
                    <Field id="lastname" label={lastNameLabel}>
                        <TextInput field="lastname" validate={isRequired} data-cy="lastname" />
                    </Field>
                </div>
                <div className={classes.country}>
                    <Country
                        field="country_code"
                        validate={isRequired}
                        data-cy="country"
                        initialValue={defaultCountryValue}
                    />
                </div>
                <div className={classes.street1}>
                    <Field id="street1" label={street1Label}>
                        <TextInput field="street[0]" validate={isRequired} data-cy="street[0]" />
                    </Field>
                </div>
                <div className={classes.street2}>
                    <Field id="street2" label={street2Label} optional={true}>
                        <TextInput field="street[1]" data-cy="street[1]" />
                    </Field>
                </div>
                <div className={classes.city}>
                    <City
                        validateOnChange
                        classes={{ input: classes.textInput }}
                        selectClasses={{ root: classes.cityRoot, input: classes.cityInput }}
                        field="city"
                        countryField="country_code"
                        id="city"
                        validate={isRequired}
                    />
                </div>
                <div className={classes.telephone}>
                    <Field id="telephone" label={telephoneLabel}>
                        <TextInput
                            field="telephone"
                            isRequired={true}
                            validate={combine([isRequired, validatePhoneNumber])}
                            data-cy="telephone"
                        />
                    </Field>
                </div>
                {defaultAdressesCheckboxes}
            </div>
        </Dialog>
    );
};

export default AddEditDialog;

AddEditDialog.propTypes = {
    classes: shape({
        root: string,
        city: string,
        country: string,
        default_address_check: string,
        errorContainer: string,
        firstname: string,
        lastname: string,
        middlename: string,
        postcode: string,
        region: string,
        street1: string,
        street2: string,
        telephone: string
    }),
    formErrors: object,
    isEditMode: bool,
    isOpen: bool,
    onCancel: func,
    onConfirm: func
};
