import { useApolloClient, useMutation } from '@apollo/client';
import { useCallback, useRef, useMemo } from 'react';

import { useAppContext } from '@app/context/App';
import { useCaptcha } from '@app/hooks/useCaptcha';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { retrieveCartId } from '@magento/peregrine/lib/store/actions/cart';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/SignIn/signIn.gql';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useSignIn = props => {
    const { getCartDetailsQuery, setDefaultUsername, showCreateAccount, showForgotPassword } = props;

    const { captchaHeaders, executeCaptchaValidation, isExecutingCaptcha } = useCaptcha();
    const [{ isSigningIn }, { setIsSigningIn }] = useAppContext();
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { createCartMutation, getCustomerQuery, mergeCartsMutation, signInMutation } = operations;
    const [, { addToast }] = useToasts();
    const apolloClient = useApolloClient();

    const [{ cartId }, { createCart, removeCart, getCartDetails }] = useCartContext();

    const [{ isGettingDetails, getDetailsError }, { getUserDetails, setToken }] = useUserContext();

    const [signIn, { error: signInError }] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeaders
        }
    });

    const [fetchCartId] = useMutation(createCartMutation);
    const [mergeCarts] = useMutation(mergeCartsMutation);
    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);

    const handleSubmit = useCallback(
        async ({ email, password }) => {
            try {
                await executeCaptchaValidation('sign_in');

                // This needs to be after captcha callback so that we do not cause checkout to rerender
                setIsSigningIn(true);

                // Get source cart id (guest cart id).
                const sourceCartId = cartId;

                // Sign in and set the token.
                const signInResponse = await signIn({
                    variables: { email, password }
                });
                const token = signInResponse.data.generateCustomerToken.token;
                await setToken(token);

                // Clear all cart/customer data from cache and redux.
                await apolloClient.clearCacheData(apolloClient, 'cart');
                await apolloClient.clearCacheData(apolloClient, 'checkout');
                await removeCart();

                // Create and get the customer's cart id.
                await createCart({
                    fetchCartId
                });
                const destinationCartId = await retrieveCartId();

                // Merge the guest cart into the customer cart.
                await mergeCarts({
                    variables: {
                        destinationCartId,
                        sourceCartId
                    }
                });

                // Ensure old stores are updated with any new data.
                await getUserDetails({ fetchUserDetails });
                await getCartDetails({ fetchCartId, fetchCartDetails });
                setIsSigningIn(false);
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                if (error) {
                    addToast({
                        type: 'error',
                        message: error.message
                    });
                }

                setIsSigningIn(false);
            }
        },
        [
            setIsSigningIn,
            executeCaptchaValidation,
            cartId,
            signIn,
            setToken,
            apolloClient,
            removeCart,
            createCart,
            fetchCartId,
            mergeCarts,
            getUserDetails,
            fetchUserDetails,
            getCartDetails,
            fetchCartDetails,
            addToast
        ]
    );

    const handleForgotPassword = useCallback(
        e => {
            const { current: formApi } = formApiRef;
            e.stopPropagation();

            if (formApi) {
                setDefaultUsername(formApi.getValue('email'));
            }

            showForgotPassword();
        },
        [setDefaultUsername, showForgotPassword]
    );

    const handleCreateAccount = useCallback(
        e => {
            const { current: formApi } = formApiRef;
            e.stopPropagation();
            if (formApi) {
                setDefaultUsername(formApi.getValue('email'));
            }

            showCreateAccount();
        },
        [setDefaultUsername, showCreateAccount]
    );

    const errors = useMemo(() => new Map([['getUserDetailsQuery', getDetailsError], ['signInMutation', signInError]]), [
        getDetailsError,
        signInError
    ]);

    return {
        errors,
        handleCreateAccount,
        handleForgotPassword,
        handleSubmit,
        isBusy: isGettingDetails || isSigningIn || isExecutingCaptcha,
        setFormApi
    };
};
