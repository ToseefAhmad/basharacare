import { useMutation } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { useCaptcha } from '@app/hooks/useCaptcha';
import { useToasts } from '@magento/peregrine';
import { useCartContext } from '@magento/peregrine/lib/context/cart.js';
import { useUserContext } from '@magento/peregrine/lib/context/user.js';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery.js';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/OrderConfirmationPage/createAccount.gql.js';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge.js';

/**
 * Returns props necessary to render CreateAccount component. In particular this
 * talon handles the submission flow by first doing a pre-submisson validation
 * and then, on success, invokes the `onSubmit` prop, which is usually the action.
 *
 * This talon is almost identical to the other useCreateAccount but does not
 * return `isSignedIn`.
 *
 * @param {Object} props.initialValues initial values to sanitize and seed the form
 * @param {Function} props.onSubmit the post submit callback
 * @param {Object} props.operations GraphQL operations use by talon
 * @returns {{
 *   errors: Map,
 *   handleSubmit: function,
 *   isDisabled: boolean,
 *   initialValues: object
 * }}
 */
export const useCreateAccount = props => {
    const { initialValues = {}, onSubmit } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        createAccountMutation,
        createCartMutation,
        getCartDetailsQuery,
        getCustomerQuery,
        signInMutation
    } = operations;
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const [, { createCart, getCartDetails, removeCart }] = useCartContext();
    const [{ isGettingDetails }, { getUserDetails, setToken }] = useUserContext();

    const {
        captchaHeaders: captchaHeadersCreateAccount,
        executeCaptchaValidation: executeCaptchaValidationCreateAccount
    } = useCaptcha();
    const {
        captchaHeaders: captchaHeadersSignIn,
        executeCaptchaValidation: executeCaptchaValidationSignIn
    } = useCaptcha();

    const [fetchCartId] = useMutation(createCartMutation);

    // For create account and sign in mutations, we don't want to cache any
    // Personally identifiable information (PII). So we set fetchPolicy to 'no-cache'.
    const [createAccount, { error: createAccountError }] = useMutation(createAccountMutation, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeadersCreateAccount
        }
    });

    const [signIn, { error: signInError }] = useMutation(signInMutation, {
        fetchPolicy: 'no-cache',
        context: {
            headers: captchaHeadersSignIn
        }
    });

    const fetchUserDetails = useAwaitQuery(getCustomerQuery);
    const fetchCartDetails = useAwaitQuery(getCartDetailsQuery);

    const handleSubmit = useCallback(
        async formValues => {
            setIsSubmitting(true);
            try {
                await executeCaptchaValidationCreateAccount('create_account');

                // Create the account and then sign in.
                await createAccount({
                    variables: {
                        email: formValues.customer.email,
                        firstname: formValues.customer.firstname,
                        lastname: formValues.customer.lastname,
                        password: formValues.password,
                        is_subscribed: !!formValues.subscribe
                    }
                });

                addToast({
                    type: 'info',
                    message: formatMessage({
                        id: 'checkoutPage.accountSuccessfullyCreated',
                        defaultMessage: 'Account successfully created.'
                    }),
                    timeout: 5000
                });

                await executeCaptchaValidationSignIn('sign_in');

                const signInResponse = await signIn({
                    variables: {
                        email: formValues.customer.email,
                        password: formValues.password
                    }
                });
                const token = signInResponse.data.generateCustomerToken.token;
                await setToken(token);

                // Clear guest cart from redux.
                await removeCart();

                // Create a new customer cart.
                await createCart({
                    fetchCartId
                });

                // Ensure old stores are updated with any new data.
                await getUserDetails({ fetchUserDetails });
                await getCartDetails({
                    fetchCartId,
                    fetchCartDetails
                });

                // Finally, invoke the post-submission callback.
                if (onSubmit) {
                    onSubmit();
                }
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
                setIsSubmitting(false);
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
            onSubmit,
            removeCart,
            setToken,
            signIn,
            addToast,
            executeCaptchaValidationCreateAccount,
            executeCaptchaValidationSignIn,
            formatMessage
        ]
    );

    const sanitizedInitialValues = useMemo(() => {
        const { email, firstName, lastName, ...rest } = initialValues;

        return {
            customer: { email, firstname: firstName, lastname: lastName },
            ...rest
        };
    }, [initialValues]);

    const errors = useMemo(
        () => new Map([['createAccountQuery', createAccountError], ['signInMutation', signInError]]),
        [createAccountError, signInError]
    );

    return {
        errors,
        handleSubmit,
        isDisabled: isSubmitting || isGettingDetails,
        initialValues: sanitizedInitialValues
    };
};
