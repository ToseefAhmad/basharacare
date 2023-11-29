import { useQuery, useMutation } from '@apollo/client';
import DEFAULT_OPERATIONS from '@magebit/pwa-studio-payfortFortCc/src/talons/payment.gql';
import { useCallback, useEffect, useRef } from 'react';

import { usePaymentContext } from '@app/components/overrides/CheckoutPage/checkoutPage';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 *
 * @param props
 * @returns {{instructions: string, onBillingAddressChangedError: ((function(): void)|*), handleChange: ((function({number: *, holderName: *, expiryDate: *, cvv: *}): void)|*), onBillingAddressChangedSuccess: ((function(): void)|*), setFormApi: (function(*): any), title: string}}
 */
export const usePayfortFortCc = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { getPaymentConfigQuery, setPaymentMethodOnCartMutation } = operations;

    const [{ cartId }] = useCartContext();
    const { data } = useQuery(getPaymentConfigQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { resetShouldSubmit, onPaymentSuccess, onPaymentError } = props;
    const { handleCartToggle } = usePaymentContext();

    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setPaymentMethodOnCartMutation);

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const formUpdate = useCallback(
        (number, holderName, monthDate, yearDate, cvv) => {
            const updateValues = {
                number: number,
                holderName: holderName,
                monthDate: monthDate,
                yearDate: yearDate,
                cvv: cvv
            };
            formApiRef.current.setValues(updateValues);
            handleCartToggle(updateValues);
        },
        [handleCartToggle]
    );

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

        if (paymentMethodMutationCompleted && !paymentMethodMutationError) {
            onPaymentSuccess();
        }

        if (paymentMethodMutationCompleted && paymentMethodMutationError) {
            onPaymentError();
        }
    }, [
        paymentMethodMutationError,
        paymentMethodMutationLoading,
        paymentMethodMutationCalled,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit
    ]);

    const handleChange = useCallback(
        ({ number, holderName, monthDate, yearDate, cvv }) => {
            formUpdate(number, holderName, monthDate, yearDate, cvv);
        },
        [formUpdate]
    );

    return {
        title: data?.storeConfig?.payment_payfort_fort_cc_title || 'Cart',
        instructions: data?.storeConfig?.payment_payfort_fort_cc_instructions || '',
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        setFormApi,
        handleChange
    };
};
