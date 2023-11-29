import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo } from 'react';

import { GET_STORE_CREDIT, CHANGE_CUSTOMER_CREDIT_SUBSCRIPTION } from '@app/components/StoreCredit/storeCredit.gql';
import { useUserContext } from '@magento/peregrine/lib/context/user';

const UseStoreCredit = ({ afterSubmit }) => {
    const [{ isSignedIn }] = useUserContext();
    const { data: storeCreditData } = useQuery(GET_STORE_CREDIT, {
        skip: !isSignedIn,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const initialValues = useMemo(() => {
        if (storeCreditData) {
            return { isSubscribed: storeCreditData.customer.credit.isSubscribed };
        }
    }, [storeCreditData]);

    const [
        setCustomerCreditSubscription,
        { error: setCustomerCreditSubscriptionError, loading: isSubmitting }
    ] = useMutation(CHANGE_CUSTOMER_CREDIT_SUBSCRIPTION);

    const formatBalance = (currencyCode, balanceToFormat, positiveIndicator = false) => {
        const addingIndicator = positiveIndicator ? '+' : '';
        const balanceChangeAbs = Math.abs(balanceToFormat);
        return balanceToFormat < 0
            ? `-${currencyCode} ${balanceChangeAbs}`
            : `${addingIndicator}${currencyCode} ${balanceChangeAbs}`;
    };

    const handleSubmit = useCallback(
        async formValues => {
            try {
                await setCustomerCreditSubscription({
                    variables: formValues
                });
            } catch {
                // We have an onError link that logs errors, and FormError already renders this error, so just return
                // To avoid triggering the success callback
                return;
            }
            if (afterSubmit) {
                afterSubmit();
            }
        },
        [afterSubmit, setCustomerCreditSubscription]
    );

    const customerCreditData = storeCreditData ? storeCreditData.customer.credit : [];
    const transactions = storeCreditData ? storeCreditData.customer.credit.transactions : [];

    return {
        customerCreditData,
        formErrors: [setCustomerCreditSubscriptionError],
        handleSubmit,
        isSubmitting,
        initialValues,
        transactions,
        formatBalance
    };
};

export default UseStoreCredit;
