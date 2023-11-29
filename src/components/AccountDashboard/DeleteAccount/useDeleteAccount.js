import { useMutation } from '@apollo/client';
import { useCallback, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useUserContext } from '@magento/peregrine/lib/context/user';

import { DELETE_CUSTOMER_ACCOUNT } from './deleteAccount.gql';

export const useDeleteAccount = () => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { formatMessage } = useIntl();
    const [, { signOut }] = useUserContext();
    const [deleteCustomerAccount, { loading }] = useMutation(DELETE_CUSTOMER_ACCOUNT);
    const history = useHistory();
    const [, { addToast }] = useToasts();

    const handleSubmit = useCallback(async () => {
        try {
            setIsDialogOpen(false);
            const result = await deleteCustomerAccount();

            if (result?.data?.deleteCustomer) {
                signOut();
                history.go(0);
                addToast({
                    type: ToastType.SUCCESS,
                    message: formatMessage({
                        id: 'deleteAccount.success',
                        defaultMessage: 'Successfully deleted your account'
                    })
                });
            } else {
                addToast({
                    type: ToastType.ERROR,
                    message: formatMessage({
                        id: 'global.somethingWentWrong',
                        defaultMessage: 'Something went wrong. Please try again later'
                    })
                });
            }
        } catch (e) {
            addToast({
                type: ToastType.ERROR,
                message: e.message
            });
        }
    }, [addToast, deleteCustomerAccount, formatMessage, history, signOut]);

    return {
        isDialogOpen,
        setIsDialogOpen,
        handleSubmit,
        loading
    };
};
