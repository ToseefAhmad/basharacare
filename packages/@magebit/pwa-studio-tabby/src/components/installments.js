import React, { useEffect } from 'react';
import { bool, func } from 'prop-types';
import { useTabby } from '@magebit/pwa-studio-tabby/src/talons/useTabby';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import { useState } from 'react';

import classes from './tabby.module.css';
import {FormattedMessage} from "react-intl";

const PAYMENT_CODE = 'tabby_installments';

const Installments = props => {
    const { onBillingAddressChangedError, onBillingAddressChangedSuccess } = useTabby(PAYMENT_CODE, props)

    return (
        <div className={classes.root}>
            <div>
                <FormattedMessage
                    id="tabby.redirectMessage"
                    values={{
                        gateway: 'Tabby'
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
