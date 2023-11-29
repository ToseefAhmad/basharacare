import { Form } from 'informed';
import { bool, func, shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import DeliveryInfo from '@app/components/DeliveryInfo/deliveryInfo';
import Button from '@app/components/overrides/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';
import FormError from '@magento/venia-ui/lib/components/FormError';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import CompletedView from './completedView';
import defaultClasses from './shippingMethod.module.css';
import ShippingRadios from './shippingRadios';
import UpdateModal from './updateModal';
import { displayStates, useShippingMethod } from './useShippingMethod';

const initializingContents = (
    <LoadingIndicator>
        <FormattedMessage id="shippingMethod.loading" defaultMessage="Loading shipping methods..." />
    </LoadingIndicator>
);

const ShippingMethod = props => {
    const { onSave, onSuccess, pageIsUpdating, setPageIsUpdating } = props;

    const talonProps = useShippingMethod({
        onSave,
        onSuccess,
        setPageIsUpdating
    });

    const {
        displayState,
        shippingCity,
        errors,
        handleSubmit,
        isLoading,
        shippingMethods,
        deliveryInputOptions,
        handleChangeDeliveryMethod,
        selectedMethod,
        selectedShippingMethod,
        showUpdateMode,
        handleCancelUpdate,
        isUpdateMode
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    let contents;

    if (displayState === displayStates.DONE) {
        const updateFormInitialValues = {
            shipping_method: selectedShippingMethod.serializedValue
        };
        contents = (
            <Fragment>
                <div className={classes.done} data-cy="ShippingMethod-done">
                    <CompletedView selectedShippingMethod={selectedShippingMethod} showUpdateMode={showUpdateMode} />
                </div>
                <UpdateModal
                    classes={{ contents: classes.updateModalContents }}
                    formErrors={Array.from(errors.values())}
                    formInitialValues={updateFormInitialValues}
                    handleCancel={handleCancelUpdate}
                    handleSubmit={handleSubmit}
                    isLoading={isLoading}
                    isOpen={isUpdateMode}
                    shippingCity={shippingCity}
                    pageIsUpdating={pageIsUpdating}
                    shippingMethods={shippingMethods}
                    selectedMethod={selectedMethod}
                    deliveryInputOptions={deliveryInputOptions}
                    onOptionChange={handleChangeDeliveryMethod}
                />
            </Fragment>
        );
    } else {
        // We're either initializing or editing.
        let bodyContents = initializingContents;

        if (displayState === displayStates.EDITING) {
            const lowestCostShippingMethodSerializedValue = shippingMethods.length
                ? shippingMethods[0].serializedValue
                : '';
            const lowestCostShippingMethod = {
                shipping_method: lowestCostShippingMethodSerializedValue
            };

            bodyContents = (
                <Form className={classes.form} initialValues={lowestCostShippingMethod} onSubmit={handleSubmit}>
                    <ShippingRadios
                        onOptionChange={handleChangeDeliveryMethod}
                        disabled={pageIsUpdating || isLoading}
                        shippingMethods={shippingMethods}
                    />
                    <DeliveryInfo
                        shippingCity={shippingCity}
                        selectedMethod={selectedMethod}
                        deliveryInputOptions={deliveryInputOptions}
                    />

                    <div className={classes.formButtons}>
                        <Button
                            data-cy="ShippingMethod-submitButton"
                            priority="high"
                            type="submit"
                            disabled={pageIsUpdating || isLoading}
                        >
                            <FormattedMessage
                                id="shippingMethod.continueToNextStep"
                                defaultMessage="Continue to Payment Information"
                            />
                        </Button>
                    </div>
                </Form>
            );
        }

        contents = (
            <div className={classes.root}>
                <h3 className={classes.editingHeading}>
                    <span>
                        <FormattedMessage id="shippingMethod.headingFirst" defaultMessage="Shipping " />
                    </span>

                    <FormattedMessage id="shippingMethod.headingSecond" defaultMessage="Method" />
                </h3>
                <FormError errors={Array.from(errors.values())} />
                {bodyContents}
            </div>
        );
    }

    return <Fragment>{contents}</Fragment>;
};

ShippingMethod.propTypes = {
    classes: shape({
        done: string,
        editingHeading: string,
        form: string,
        formButtons: string,
        root: string
    }),
    onSave: func.isRequired,
    onSuccess: func.isRequired,
    pageIsUpdating: bool,
    setPageIsUpdating: func.isRequired
};

export default ShippingMethod;
