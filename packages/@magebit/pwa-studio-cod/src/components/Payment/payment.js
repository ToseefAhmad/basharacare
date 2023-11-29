import React from 'react';
import { shape, string, bool, func } from 'prop-types';

import { useStyle } from '@magento/venia-ui/lib/classify';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';

import { useCashOnDelivery } from '../../talons/useCashOnDelivery';
import defaultClasses from './payment.css';
import { FormattedMessage } from "react-intl";

/**
 * The CashOnDelivery component renders all information to handle cash on delivery payment.
 *
 * @param {String} props.title shop owner payment title.
 * @param {String} props.instructions shop owner post additional content.
 * @param {Boolean} props.shouldSubmit boolean value which represents if a payment nonce request has been submitted
 * @param {Function} props.onPaymentSuccess callback to invoke when the a payment nonce has been generated
 * @param {Function} props.onDropinReady callback to invoke when the braintree dropin component is ready
 * @param {Function} props.onPaymentError callback to invoke when component throws an error
 * @param {Function} props.resetShouldSubmit callback to reset the shouldSubmit flag
 */
const CashOnDelivery = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const addressTemplate = str => (
        <span key={str} className={classes.addressLine}>
            {str} <br />
        </span>
    );

    const {
        instructions,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    } = useCashOnDelivery(props);

    return (
        <div className={classes.root}>
            <BillingAddress
                resetShouldSubmit={props.resetShouldSubmit}
                shouldSubmit={props.shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

CashOnDelivery.propTypes = {
    classes: shape({ root: string }),
    title: string,
    instructions: string,
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onDropinReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

CashOnDelivery.defaultProps = {
    title: 'Cash on Delivery',
    instructions: ''
};

export default CashOnDelivery;
