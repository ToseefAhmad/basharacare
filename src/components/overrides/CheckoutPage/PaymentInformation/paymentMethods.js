import { shape, string, bool, func } from 'prop-types';
import React, { useEffect } from 'react';
import { useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import { usePaymentMethods } from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/usePaymentMethods';
import { useStyle } from '@magento/venia-ui/lib/classify';
import payments from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection';
import Image from '@magento/venia-ui/lib/components/Image';
import RadioGroup from '@magento/venia-ui/lib/components/RadioGroup';
import Radio from '@magento/venia-ui/lib/components/RadioGroup/radio';

import defaultClasses from './paymentMethods.module.css';

const PaymentMethods = props => {
    const {
        classes: propClasses,
        onPaymentError,
        onPaymentSuccess,
        resetShouldSubmit,
        shouldSubmit,
        handleReviewOrder,
        reviewOrderBtnDisabled,
        setSelectedPaymentMethod,
        selectedPaymentMethod,
        scrollIntoView,
        anchorRef
    } = props;

    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = usePaymentMethods({});

    const { availablePaymentMethods, isLoading, currentSelectedPaymentMethod } = talonProps;

    useEffect(() => {
        if (!selectedPaymentMethod) {
            setSelectedPaymentMethod(currentSelectedPaymentMethod);
        }
    }, [currentSelectedPaymentMethod, selectedPaymentMethod, setSelectedPaymentMethod]);

    if (isLoading) {
        return null;
    }

    const radios = availablePaymentMethods
        .map(({ code, title, icon }) => {
            // If we don't have an implementation for a method type, ignore it.
            if (!Object.keys(payments).includes(code)) {
                return;
            }

            if (!globalThis.ApplePaySession && code.includes('applepay')) {
                return;
            }

            const id = `paymentMethod--${code}`;
            const isSelected = currentSelectedPaymentMethod === code;
            const PaymentMethodComponent = payments[code];
            const renderedComponent = isSelected ? (
                <PaymentMethodComponent
                    onPaymentSuccess={onPaymentSuccess}
                    onPaymentError={onPaymentError}
                    resetShouldSubmit={resetShouldSubmit}
                    shouldSubmit={shouldSubmit}
                />
            ) : null;
            return (
                <div key={code} className={classes.payment_method}>
                    <div className={classes.paymentLabel}>
                        <Radio
                            id={id}
                            label={title}
                            value={code}
                            classes={{
                                label: classes.radio_label
                            }}
                            checked={isSelected}
                            onChange={() => {
                                setSelectedPaymentMethod(code);
                            }}
                        />
                        {icon && (
                            <div className={classes.paymentIcon}>
                                <Image src={icon} />
                            </div>
                        )}
                    </div>
                    {renderedComponent}
                </div>
            );
        })
        .filter(paymentMethod => !!paymentMethod);

    const submitButtonProps = {
        priority: 'high',
        type: 'submit',
        onPress: () => {
            handleReviewOrder();
            scrollIntoView(anchorRef);
        },
        disabled: !selectedPaymentMethod || reviewOrderBtnDisabled
    };

    const continueToReviewOrderButton = radios.length ? (
        <div className={classes.buttons}>
            <Button {...submitButtonProps} data-cy="continue-review-button">
                {formatMessage({
                    id: 'checkoutPage.continueToReviewOrderButton',
                    defaultMessage: 'Continue order review'
                })}
            </Button>
        </div>
    ) : null;

    const noPaymentMethodMessage = !radios.length ? (
        <div className={classes.payment_errors}>
            <span>
                {formatMessage({
                    id: 'checkoutPage.paymentLoadingError',
                    defaultMessage: 'There was an error loading payments.'
                })}
            </span>
            <span>
                {formatMessage({
                    id: 'checkoutPage.refreshOrTryAgainLater',
                    defaultMessage: 'Please refresh or try again later.'
                })}
            </span>
        </div>
    ) : null;

    return (
        <div className={classes.root}>
            <RadioGroup classes={{ root: classes.radio_group }} field="selectedPaymentMethod">
                {radios}
            </RadioGroup>
            {noPaymentMethodMessage}
            {continueToReviewOrderButton}
        </div>
    );
};

export default PaymentMethods;

PaymentMethods.propTypes = {
    classes: shape({
        root: string,
        payment_method: string,
        radio_label: string
    }),
    onPaymentSuccess: func,
    onPaymentError: func,
    resetShouldSubmit: func,
    selectedPaymentMethod: string,
    shouldSubmit: bool
};
