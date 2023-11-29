import { Form } from 'informed';
import { shape, string, bool, func } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Field from '@app/components/overrides/Field';
import Select from '@app/components/overrides/Select';
import TextInput from '@app/components/overrides/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';
import BillingAddress from '@magento/venia-ui/lib/components/CheckoutPage/BillingAddress';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';
import combine from '@magento/venia-ui/lib/util/combineValidators';

import defaultClasses from './payment.css';
import { usePayfortFortCc } from './usePayfortFortCc';
import { validCardNumber } from '@app/util/formValidator';

/**
 *
 * @param props
 * @returns {JSX.Element}
 * @constructor
 */
const PayfortFortCc = props => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        handleInputChange,
        dateOptions: {month, year}
    } = usePayfortFortCc(props);

    return (
        <div className={classes.root}>
            <Field
                label={formatMessage({
                    id: 'global.ccNumber',
                    defaultMessage: 'Credit Card Number'
                })}
                field="number"
            >
                <TextInput
                    maxLength="19"
                    field="number"
                    id="number"
                    onChange={handleInputChange}
                    mask={value => value && value.trim() && value.replace(/\D/g, '')}
                    data-cy="number"
                    validate={combine([isRequired, validCardNumber])}
                />
            </Field>
            <Field
                label={formatMessage({
                    id: 'global.holderName',
                    defaultMessage: 'Card Holder Name'
                })}
                field="holderName"
            >
                <TextInput
                    id="holderName"
                    onChange={handleInputChange}
                    field="holderName"
                    validate={isRequired}
                    data-cy="holderName"
                />
            </Field>
            <div className={classes.expiryDate}>
                <Field
                    label={formatMessage({
                        id: 'global.monthDate',
                        defaultMessage: 'Month Date'
                    })}
                    field="monthDate"
                >
                    <Select
                        classes={{ input: classes.selectInput }}
                        id="monthDate"
                        field="monthDate"
                        onChange={handleInputChange}
                        validate={isRequired}
                        data-cy="monthDate"
                        items={month}
                    />
                </Field>
                <Field
                    label={formatMessage({
                        id: 'global.yearDate',
                        defaultMessage: 'Year Date'
                    })}
                    field="yearDate"
                >
                    <Select
                        classes={{ input: classes.selectInput }}
                        id="yearDate"
                        field="yearDate"
                        onChange={handleInputChange}
                        validate={isRequired}
                        data-cy="yearDate"
                        items={year}
                    />
                </Field>
            </div>
            <Field
                label={formatMessage({
                    id: 'global.cvv',
                    defaultMessage: 'Card Verification Number'
                })}
                field="cvv"
            >
                <TextInput
                    maskOnBlur={true}
                    mask={value => value && value.trim()}
                    type="password"
                    id="cvv"
                    field="cvv"
                    maxLength="4"
                    onChange={handleInputChange}
                    validate={isRequired}
                    data-cy="cvv"
                />
            </Field>
            <BillingAddress
                resetShouldSubmit={props.resetShouldSubmit}
                shouldSubmit={props.shouldSubmit}
                onBillingAddressChangedError={onBillingAddressChangedError}
                onBillingAddressChangedSuccess={onBillingAddressChangedSuccess}
            />
        </div>
    );
};

PayfortFortCc.propTypes = {
    classes: shape({ root: string }),
    title: string,
    instructions: string,
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onDropinReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};

PayfortFortCc.defaultProps = {
    title: 'Credit / Debit Card',
    instructions: ''
};

export default PayfortFortCc;
