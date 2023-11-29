import React, { useEffect } from 'react';
import { bool, func } from 'prop-types';
import { useTamara } from '@magebit/pwa-studio-tamara/src/talons/useTamara';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import { useState } from 'react';

import classes from './tamara.module.css';
import {FormattedMessage} from "react-intl";

const PAYMENT_CODE = 'tamara_pay_by_instalments';

const Installments = props => {
    const { onBillingAddressChangedError, onBillingAddressChangedSuccess } = useTamara(PAYMENT_CODE, props)

    return (
        <div className={classes.root}>
            <div>
                <FormattedMessage
                    id="tamara.redirectMessage"
                    values={{
                        gateway: 'Tamara'
                    }}
                    defaultMessage={`After clicking "Place the Order", you will be redirected to {gateway} to complete your purchase securely.`}
                />
            </div>
            <div className={classes.billingAddressCheckbox}>
                <BillingAddress
                        resetShouldSubmit={props.resetShouldSubmit}
                        shouldSubmit={props.shouldSubmit}
                        onBillingAddressChangedError={onBillingAddressChangedError}
                        onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
                    />
            </div>
        </div>
    );
}

Installments.propTypes = {
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

export default Installments;
