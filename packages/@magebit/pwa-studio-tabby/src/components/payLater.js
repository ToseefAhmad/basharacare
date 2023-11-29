import React from 'react';
import { bool, func } from 'prop-types';
import { useTabby } from '@magebit/pwa-studio-tabby/src/talons/useTabby';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import classes from "./tabby.module.css";

const PAYMENT_CODE = 'tabby_checkout';

const PayLater = props => {
    const { onBillingAddressChangedError, onBillingAddressChangedSuccess } = useTabby(PAYMENT_CODE, props)

    return (
        <div className={classes.root}>
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

PayLater.propTypes = {
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onPaymentReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

export default PayLater;
