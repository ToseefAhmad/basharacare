import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo, useRef, useState } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';

import { APPLY_STORE_CREDIT_TO_CART, GET_CUSTOMER_STORE_CREDIT } from './storeCreditForm.gql';

export const useStoreCreditForm = ({ appliedAmount }) => {
    const [{ cartId }] = useCartContext();
    const formApi = useRef();
    const [hasValue, setHasValue] = useState(false);

    const [applyStoreCredits, { loading }] = useMutation(APPLY_STORE_CREDIT_TO_CART);
    const { data: customerCredit } = useQuery(GET_CUSTOMER_STORE_CREDIT, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const setFormApi = useCallback(api => (formApi.current = api), []);

    const onInputChange = useCallback(
        event => {
            if (event.target.value && !hasValue) {
                setHasValue(true);
            } else if (!event.target.value && hasValue) {
                setHasValue(false);
            }
        },
        [hasValue, setHasValue]
    );

    const handleSubmit = useCallback(
        ({ amount }) => {
            const balance = customerCredit?.customer?.credit?.balance;
            if (appliedAmount) {
                applyStoreCredits({
                    variables: {
                        amount: 0,
                        cartId
                    }
                });
                return;
            }
            if (!amount && balance) {
                applyStoreCredits({
                    variables: {
                        amount: balance.amount?.value,
                        cartId
                    }
                });
            } else {
                applyStoreCredits({
                    variables: {
                        amount,
                        cartId
                    }
                });
            }
        },
        [applyStoreCredits, cartId, customerCredit, appliedAmount]
    );

    const availableCredit = useMemo(() => {
        const balance = customerCredit?.customer?.credit?.balance;
        if (balance) {
            const amount = balance.amount?.value || 0;
            const currencyCode = balance.currency_code;

            return `${currencyCode} ${amount}`;
        }

        return '0';
    }, [customerCredit]);

    return {
        handleSubmit,
        availableCredit,
        hasValue,
        loading,
        onInputChange,
        setFormApi
    };
};
