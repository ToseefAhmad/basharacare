import { useMutation } from '@apollo/client';
import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { useCaptcha } from '@app/hooks/useCaptcha';
import { useToasts } from '@magento/peregrine/lib/Toasts';

/**
 * Returns props necessary to render a ForgotPassword form.
 *
 * @function
 *
 * @param {Function} props.onCancel - callback function to call when user clicks the cancel button
 * @param {RequestPasswordEmailMutations} props.mutations - GraphQL mutations for the forgot password form.
 *
 * @returns {ForgotPasswordProps}
 *
 * @example <caption>Importing into your project</caption>
 * import { useForgotPassword } from '@magento/peregrine/lib/talons/ForgotPassword/useForgotPassword.js';
 */
export const useForgotPassword = props => {
    const { onCancel, mutations } = props;
    const { captchaHeaders, executeCaptchaValidation } = useCaptcha();
    const [hasCompleted, setCompleted] = useState(false);
    const [forgotPasswordEmail, setForgotPasswordEmail] = useState(null);
    const [, { addToast }] = useToasts();
    const history = useHistory();
    const [requestResetEmail, { error: requestResetEmailError, loading: isResettingPassword }] = useMutation(
        mutations.requestPasswordResetEmailMutation,
        {
            context: {
                headers: captchaHeaders
            }
        }
    );

    const handleFormSubmit = useCallback(
        async ({ email }) => {
            try {
                await executeCaptchaValidation('forgot_password');
                await requestResetEmail({ variables: { email } });
                addToast({
                    type: 'success',
                    message: (
                        <FormattedMessage
                            id="forgotPassword.informationText"
                            defaultMessage="If there is an account associated with {email} you will receive an email with a link to change your password."
                            values={{
                                email
                            }}
                        />
                    )
                });
                setForgotPasswordEmail(email);
                history.push('/sign-in');
                setCompleted(true);
            } catch (err) {
                setCompleted(false);
            }
        },
        [addToast, executeCaptchaValidation, history, requestResetEmail]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    return {
        forgotPasswordEmail,
        formErrors: [requestResetEmailError],
        handleCancel,
        handleFormSubmit,
        hasCompleted,
        isResettingPassword
    };
};

/** JSDocs type definitions */

/**
 * GraphQL mutations for the forgot password form.
 * This is a type used by the {@link useForgotPassword} talon.
 *
 * @typedef {Object} RequestPasswordEmailMutations
 *
 * @property {GraphQLAST} requestPasswordResetEmailMutation mutation for requesting password reset email
 *
 * @see [forgotPassword.gql.js]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/ForgotPassword/forgotPassword.gql.js}
 * for the query used in Venia
 */

/**
 * Object type returned by the {@link useForgotPassword} talon.
 * It provides props data to use when rendering the forgot password form component.
 *
 * @typedef {Object} ForgotPasswordProps
 *
 * @property {String} forgotPasswordEmail email address of the user whose password reset has been requested
 * @property {Array} formErrors A list of form errors
 * @property {Function} handleCancel Callback function to handle form cancellations
 * @property {Function} handleFormSubmit Callback function to handle form submission
 * @property {Boolean} hasCompleted True if password reset mutation has completed. False otherwise
 * @property {Boolean} isResettingPassword True if password reset mutation is in progress. False otherwise
 */
