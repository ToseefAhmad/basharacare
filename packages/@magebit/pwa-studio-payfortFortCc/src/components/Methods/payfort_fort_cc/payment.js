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

import defaultClasses from './payment.css';
import { usePayfortFortCc } from './usePayfortFortCc';

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
        setFormApi,
        handleChange
    } = usePayfortFortCc(props);

    const fullYear = new Date().getFullYear();
    const yearDate = [];
    for (let i = 0; i < 10; i++) {
        const value = fullYear + i;
        yearDate.push({
            key: i,
            value: value.toString().slice(2),
            label: value
        });
    }

    const monthDate = [];
    for (let i = 0; i < 12; i++) {
        const month = i + 1;
        monthDate.push({
            key: month,
            value: month > 9 ? month : `0${month}`,
            label: month > 9 ? month : `0${month}`
        });
    }

    return (
        <div className={classes.root}>
            <Form getApi={setFormApi} onValueChange={handleChange}>
                <Field
                    label={formatMessage({
                        id: 'global.ccNumber',
                        defaultMessage: 'Credit Card Number'
                    })}
                    field="number"
                >
                    <TextInput field="number" id="number" data-cy="number" validate={isRequired} number />
                </Field>
                <Field
                    label={formatMessage({
                        id: 'global.holderName',
                        defaultMessage: 'Card Holder Name'
                    })}
                    field="holderName"
                >
                    <TextInput id="holderName" field="holderName" validate={isRequired} data-cy="holderName" />
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
                            validate={isRequired}
                            data-cy="monthDate"
                            items={monthDate}
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
                            validate={isRequired}
                            data-cy="yearDate"
                            items={yearDate}
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
                    <TextInput id="cvv" field="cvv" validate={isRequired} data-cy="cvv" />
                </Field>
            </Form>
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
