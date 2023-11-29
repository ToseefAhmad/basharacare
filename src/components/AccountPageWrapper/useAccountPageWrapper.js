import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { SIGN_OUT } from '@magento/peregrine/lib/talons/Header/accountMenu.gql.js';

export const useAccountPageWrapper = () => {
    const [, { signOut }] = useUserContext();
    const location = useLocation();
    const history = useHistory();
    const { revokeToken } = useMutation(SIGN_OUT);

    const handleSignOut = useCallback(async () => {
        // Delete cart/user data from the redux store.
        await signOut({ revokeToken });

        // Refresh the page as a way to say "re-initialize". An alternative
        // Would be to call apolloClient.resetStore() but that would require
        // A large refactor.
        history.go(0);
    }, [history, revokeToken, signOut]);

    const pathname = location.pathname;

    return {
        handleSignOut,
        pathname
    };
};
