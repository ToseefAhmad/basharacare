import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';

import { useToasts } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useAccountInformationPage = props => {
    const {
        mutations: { setCustomerInformationMutation, changeCustomerPasswordMutation },
        queries: { getCustomerInformationQuery }
    } = props;

    const [{ isSignedIn }] = useUserContext();
    const [shouldShowNewPassword, setShouldShowNewPassword] = useState(false);
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    // Use local state to determine whether to display errors or not.
    // Could be replaced by a "reset mutation" function from apollo client.
    // https://github.com/apollographql/apollo-feature-requests/issues/170
    const [displayError, setDisplayError] = useState(false);

    const { data: accountInformationData, error: loadDataError } = useQuery(getCustomerInformationQuery, {
        skip: !isSignedIn,
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const [
        setCustomerInformation,
        { error: customerInformationUpdateError, loading: isUpdatingCustomerInformation }
    ] = useMutation(setCustomerInformationMutation);

    const [
        changeCustomerPassword,
        { error: customerPasswordChangeError, loading: isChangingCustomerPassword }
    ] = useMutation(changeCustomerPasswordMutation);

    const initialValues = useMemo(() => {
        if (accountInformationData) {
            return { customer: accountInformationData.customer };
        }
    }, [accountInformationData]);

    const handleChangePassword = useCallback(() => {
        setShouldShowNewPassword(true);
    }, [setShouldShowNewPassword]);

    const handleCancel = useCallback(() => {
        setIsUpdateMode(false);
        setShouldShowNewPassword(false);
    }, [setIsUpdateMode]);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);

        // If there were errors from removing/updating info, hide them
        // When we open the modal.
        setDisplayError(false);
    }, [setIsUpdateMode]);

    const handleSubmit = useCallback(
        async ({ email, firstname, lastname, date_of_birth, gender, password, newPassword }) => {
            try {
                email = email.trim();
                firstname = firstname.trim();
                lastname = lastname.trim();
                password = password.trim();
                newPassword = newPassword ? newPassword.trim() : newPassword;

                if (
                    initialValues.customer.email !== email ||
                    initialValues.customer.firstname !== firstname ||
                    initialValues.customer.lastname !== lastname ||
                    initialValues.customer.date_of_birth !== date_of_birth ||
                    initialValues.customer.gender !== gender
                ) {
                    await setCustomerInformation({
                        variables: {
                            customerInput: {
                                email,
                                firstname,
                                lastname,
                                date_of_birth,
                                gender,
                                // You must send password because it is required
                                // When changing email.
                                password
                            }
                        }
                    });
                    addToast({
                        type: 'success',
                        message: formatMessage({
                            id: 'accountDashboardPage.successfullyInformationSaved',
                            defaultMessage: 'Your information has been successfully saved'
                        })
                    });
                }
                if (password && newPassword) {
                    await changeCustomerPassword({
                        variables: {
                            currentPassword: password,
                            newPassword: newPassword
                        }
                    });
                    addToast({
                        type: 'success',
                        message: formatMessage({
                            id: 'resetPassword.savedPasswordText',
                            defaultMessage: 'Your new password has been saved.'
                        })
                    });
                }
                // After submission, close the form if there were no errors.
                handleCancel(false);
            } catch {
                // Make sure any errors from the mutation are displayed.
                setDisplayError(true);

                // We have an onError link that logs errors, and FormError
                // Already renders this error, so just return to avoid
                // Triggering the success callback
                return;
            }
        },
        [setCustomerInformation, handleCancel, changeCustomerPassword, initialValues, addToast, formatMessage]
    );

    const errors = displayError ? [customerInformationUpdateError, customerPasswordChangeError] : [];

    return {
        handleCancel,
        formErrors: errors,
        handleSubmit,
        handleChangePassword,
        initialValues,
        isDisabled: isUpdatingCustomerInformation || isChangingCustomerPassword,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode
    };
};
