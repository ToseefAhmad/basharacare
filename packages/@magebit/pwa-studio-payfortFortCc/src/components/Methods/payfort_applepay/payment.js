import { shape, string, bool, func } from 'prop-types';
import React, {useEffect} from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

import defaultClasses from './payment.css';
import { useApplePay } from './useApplePay';

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const PayfortApplePay = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        handleApplePlaceOrder,
        isApplicable,
        isCheckout,
        shouldSubmit
    } = useApplePay(props);

    const BillingAddressElement = isCheckout ? (
        <BillingAddress
            resetShouldSubmit={props.resetShouldSubmit}
            shouldSubmit={shouldSubmit}
            onBillingAddressChangedError={onBillingAddressChangedError}
            onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
        />
    ) : null;

    useEffect(() => {
        if (isApplicable) {
            const applePay = document.getElementById("apple-pay-button");
            applePay.addEventListener("click", handleApplePlaceOrder);
        }
    }, [isApplicable]);


    return isApplicable ? (
        <div className={classes.root}>
            <apple-pay-button class={classes.applePayButton} id='apple-pay-button' buttonstyle="black" type="plain" locale="en"></apple-pay-button>
            {BillingAddressElement}
        </div>
    ) : null;
};

PayfortApplePay.propTypes = {
    classes: shape({ root: string }),
    title: string,
    instructions: string,
    shouldSubmit: bool,
    onPaymentSuccess: func,
    onDropinReady: func,
    onPaymentError: func,
    resetShouldSubmit: func
};

PayfortApplePay.defaultProps = {
    title: 'Apple Pay'
};

export default PayfortApplePay;
