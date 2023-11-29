import { useMutation, useQuery } from "@apollo/client"

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useCallback } from "react";
import OPERATIONS from './tabby.gql';

export const useTabby = (method, props) => {
    const [{ cartId }] = useCartContext();
    const {resetShouldSubmit, onPaymentSuccess, onPaymentError} = props;
    const [submitPaymentMethod] = useMutation(OPERATIONS.setPaymentMethodOnCart, {
        variables: {
            cartId,
            code: method
        }
    })

    const handleSubmit = useCallback( async () => {
        try {
            await submitPaymentMethod();
            onPaymentSuccess()
        } catch (e) {
            onPaymentError(e.message);
        }
    }, [submitPaymentMethod, ])

     const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    const onBillingAddressChangedSuccess = useCallback(() => {
        handleSubmit()
    }, [handleSubmit, cartId]);

    return {
        handleSubmit,
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess
    }
}
