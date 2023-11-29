import React, { useCallback, useEffect, useState } from 'react';
import { AlertCircle } from 'react-feather';
import { useIntl } from 'react-intl';

import { useCheckoutContext } from '@app/context/Checkout';
import { useToasts } from '@app/hooks/useToasts';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import Icon from '@magento/venia-ui/lib/components/Icon';

const AlertCircleIcon = <Icon src={AlertCircle} attrs={{ width: 20 }} />;

export const useGuestLoginToast = ({ setGuestSignInUsername, setShowSignin }) => {
    const [{ isSignedIn }] = useUserContext();
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const [showSignInToast, setShowSignInToast] = useState(false);
    const [{ email }] = useCheckoutContext();

    const handleToastAction = useCallback(
        removeToast => {
            setGuestSignInUsername(email);
            removeToast();
            setShowSignin(true);
        },
        [setGuestSignInUsername, setShowSignin, email]
    );

    useEffect(() => {
        if (showSignInToast && !isSignedIn) {
            addToast({
                type: 'info',
                icon: AlertCircleIcon,
                message: formatMessage({
                    id: 'checkoutPage.suggestSignInMessage',
                    defaultMessage:
                        'The email you provided is associated with an existing BasharaCare account. Would you like to sign in?'
                }),
                timeout: false,
                dismissable: true,
                hasDismissAction: true,
                dismissActionText: formatMessage({
                    id: 'checkoutPage.suggestSignInDeclineMessage',
                    defaultMessage: 'No, thanks'
                }),
                actionText: formatMessage({
                    id: 'checkoutPage.suggestSignInConfirmMessage',
                    defaultMessage: 'Yes, sign in'
                }),
                onAction: removeToast => handleToastAction(removeToast)
            });
        }
    }, [addToast, formatMessage, showSignInToast, handleToastAction, isSignedIn]);

    return {
        setShowSignInToast
    };
};
