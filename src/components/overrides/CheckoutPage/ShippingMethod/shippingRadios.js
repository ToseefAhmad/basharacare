import { arrayOf, bool, number, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import RadioGroup from '@app/components/overrides/RadioGroup/radioGroup';
import { useStyle } from '@magento/venia-ui/lib/classify';
import ShippingRadio from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments/ShippingMethods/shippingRadio';

import defaultClasses from './shippingRadios.module.css';

const ShippingRadios = ({ disabled, shippingMethods, ...props }) => {
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const ERROR_MESSAGE = formatMessage({
        id: 'shippingRadios.errorLoading',
        defaultMessage: 'Error loading shipping methods. Please ensure a shipping address is set and try again.'
    });

    if (!shippingMethods.length) {
        return <span className={classes.error}>{ERROR_MESSAGE}</span>;
    }

    const radioGroupClasses = {
        message: classes.radioMessage,
        radioLabel: classes.radioLabel,
        root: classes.radioRoot
    };

    const shippingRadios = shippingMethods.map(method => {
        const label = (
            <ShippingRadio currency={method.amount.currency} name={method.method_title} price={method.amount.value} />
        );
        const value = method.serializedValue;
        const title = value > 0 ? method.carrier_title : null;

        return { label, value, title };
    });

    return (
        <RadioGroup
            {...props}
            classes={radioGroupClasses}
            disabled={disabled}
            field="shipping_method"
            id="shippingMethod"
            items={shippingRadios}
        />
    );
};

export default ShippingRadios;

ShippingRadios.propTypes = {
    classes: shape({
        error: string,
        radioMessage: string,
        radioLabel: string,
        radioRoot: string
    }),
    disabled: bool,
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
    ).isRequired
};
