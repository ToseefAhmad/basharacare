import { arrayOf, bool, func, number, object, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import DeliveryInfo from '@app/components/DeliveryInfo/deliveryInfo';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Dialog from '@magento/venia-ui/lib/components/Dialog';
import FormError from '@magento/venia-ui/lib/components/FormError';

import ShippingRadios from './shippingRadios';
import defaultClasses from './updateModal.module.css';

const UpdateModal = props => {
    const {
        classes: propClasses,
        formErrors,
        shippingCity,
        formInitialValues,
        handleCancel,
        handleSubmit,
        isLoading,
        isOpen,
        pageIsUpdating,
        shippingMethods,
        selectedMethod,
        deliveryInputOptions,
        onOptionChange
    } = props;
    const { formatMessage } = useIntl();

    const dialogButtonsDisabled = pageIsUpdating;
    const dialogSubmitButtonDisabled = isLoading;
    const dialogFormProps = {
        initialValues: formInitialValues
    };

    const classes = useStyle(defaultClasses, propClasses);

    return (
        <Dialog
            classes={propClasses}
            confirmText="Update"
            confirmTranslationId="global.updateButton"
            formProps={dialogFormProps}
            isOpen={isOpen}
            onCancel={handleCancel}
            onConfirm={handleSubmit}
            shouldDisableAllButtons={dialogButtonsDisabled}
            shouldDisableConfirmButton={dialogSubmitButtonDisabled}
            shouldUnmountOnHide={false}
            title={formatMessage({
                id: 'checkoutPage.editShippingMethod',
                defaultMessage: 'Edit Shipping Method'
            })}
            data-cy="ShippingMethod-updateModal"
        >
            <FormError classes={{ root: classes.errorContainer }} errors={formErrors} />
            <ShippingRadios
                onOptionChange={onOptionChange}
                disabled={dialogButtonsDisabled}
                shippingMethods={shippingMethods}
            />
            <DeliveryInfo
                shippingCity={shippingCity}
                selectedMethod={selectedMethod}
                deliveryInputOptions={deliveryInputOptions}
            />
        </Dialog>
    );
};

export default UpdateModal;

UpdateModal.propTypes = {
    formInitialValues: object,
    handleCancel: func,
    handleSubmit: func,
    isLoading: bool,
    isOpen: bool,
    pageIsUpdating: bool,
    shippingMethods: arrayOf(
        shape({
            amount: shape({
                currency: string,
                value: number
            }),
            available: bool,
            carrier_code: string,
            carrier_title: string,
            method_code: string,
            method_title: string,
            serializedValue: string.isRequired
        })
    )
};
