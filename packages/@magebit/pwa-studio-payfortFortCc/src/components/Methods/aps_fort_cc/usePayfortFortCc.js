import { useMutation } from '@apollo/client';
import DEFAULT_OPERATIONS from '@magebit/pwa-studio-payfortFortCc/src/talons/payment.gql';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { useCheckoutContext } from '@app/context/Checkout';
import { useFormApi } from 'informed';

/**
 *
 * @param props
 * @returns {{instructions: string, onBillingAddressChangedError: ((function(): void)|*), handleChange: ((function({number: *, holderName: *, expiryDate: *, cvv: *}): void)|*), onBillingAddressChangedSuccess: ((function(): void)|*), setFormApi: (function(*): any), title: string}}
 */
export const usePayfortFortCc = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { setPaymentApsMethodOnCartMutation } = operations;

    const [{ cartId }] = useCartContext();
    const formApi = useFormApi();

    const { resetShouldSubmit, onPaymentSuccess, onPaymentError, shouldSubmit } = props;
    const [{ apsFormData }, { setApsFormData }] = useCheckoutContext();
    const [isCartValid, setIsCartValid] = useState(false);

    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setPaymentApsMethodOnCartMutation);

    useEffect(() => {
        if (shouldSubmit) {
            try {
                formApi.validate();
                if (!formApi.screenValid()) {
                    throw new Error('Errors in the billing address form');
                } else {
                    setIsCartValid(true);
                }
            } catch (e) {
                resetShouldSubmit();
            }
        }
    }, [formApi, shouldSubmit, resetShouldSubmit, setIsCartValid]);

    /**
     * This function will be called if cant not set address.
     */
    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    /**
     * This function will be called if address was successfully set.
     */
    const onBillingAddressChangedSuccess = useCallback(() => {
        updatePaymentMethod({
            variables: {
                cartId
            }
        });
    }, [updatePaymentMethod, cartId]);

    useEffect(() => {
        const paymentMethodMutationCompleted = paymentMethodMutationCalled && !paymentMethodMutationLoading;

        if (paymentMethodMutationCompleted && !paymentMethodMutationError && isCartValid) {
            onPaymentSuccess();
        }

        if (paymentMethodMutationCompleted && paymentMethodMutationError && !isCartValid) {
            onPaymentError();
        }
    }, [
        isCartValid,
        paymentMethodMutationError,
        paymentMethodMutationLoading,
        paymentMethodMutationCalled,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit
    ]);

    const handleInputChange = useCallback(() => {
        const {
            values: { number, holderName, monthDate, yearDate, cvv }
        } = formApi.getState();
        setApsFormData({ number, holderName, monthDate, yearDate, cvv });
    }, [apsFormData, formApi, setApsFormData]);

    const dateOptions = useMemo(() => {
        const fullYear = new Date().getFullYear();
        const yearDate = [
            {
                key: 'year_initial',
                value: '',
                label: ''
            }
        ];
        for (let i = 0; i < 10; i++) {
            const value = fullYear + i;
            yearDate.push({
                key: i,
                value: value.toString().slice(2),
                label: value
            });
        }

        const monthDate = [
            {
                key: 'month_initial',
                value: '',
                label: ''
            }
        ];
        for (let i = 0; i < 12; i++) {
            const month = i + 1;
            monthDate.push({
                key: month,
                value: month > 9 ? month : `0${month}`,
                label: month > 9 ? month : `0${month}`
            });
        }

        return {
            month: monthDate,
            year: yearDate
        };
    }, []);

    return {
        dateOptions,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        handleInputChange
    };
};
