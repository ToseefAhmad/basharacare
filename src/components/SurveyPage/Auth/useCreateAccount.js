import { useMutation } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CreateAccount/createAccount.gql';

export const useCreateAccount = () => {
    const {
        createAccountMutation,
        createCartMutation,
        getCartDetailsQuery,
        getCustomerQuery,
        signInMutation
    } = DEFAULT_OPERATIONS;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, { createCart, getCartDetails, removeCart }] = useCartContext();
    const [{ isGettingDetails }, { getUserDetails, setToken }] = useUserContext();

    const [fetchCartId] = useMutation(createCartMutation);

    const [createAccount, { error: createAccountError }] = useMutation(createAccountMutation, {
        fetchPolicy: 'no-cache'
    });

    const [signIn, { error: signInError }] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache'
    });

    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const handleCreateAccount = useCallback(
        async ({ email, firstname, lastname, password, subscribe }) => {
            setIsSubmitting(true);
            try {
                // Create the account and then sign in.
                await createAccount({
                    variables: {
                        email: email,
                        firstname: firstname,
                        lastname: lastname,
                        password: password,
                        is_subscribed: !!subscribe
                    }
                });
                const signInResponse = await signIn({
                    variables: {
                        email: email,
                        password: password
                    }
                });
                const token = signInResponse.data.generateCustomerToken.token;
                await setToken(token);

                // Clear guest cart from redux.
                await removeCart();

                // Create a new customer cart.
                await createCart({ fetchCartId });

                // Ensure old stores are updated with any new data.
                await getUserDetails({ fetchUserDetails });
                await getCartDetails({ fetchCartId, fetchCartDetails });
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
                throw error;
            }
        },
        [
            createAccount,
            createCart,
            fetchCartDetails,
            fetchCartId,
            fetchUserDetails,
            getCartDetails,
            getUserDetails,
            removeCart,
            setToken,
            signIn
        ]
    );

    const errors = useMemo(
        () => new Map([['createAccountQuery', createAccountError], ['signInMutation', signInError]]),
        [createAccountError, signInError]
    );

    return {
        errors,
        isBusy: isSubmitting || isGettingDetails,
        createAccount: handleCreateAccount
    };
};
