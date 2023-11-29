import { useQuery } from '@apollo/client';
import { useEffect } from 'react';

import { useAwaitQuery } from '@app/hooks/useAwaitQuery';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

import { GET_CUSTOMER_DATA } from './customerDetails.gql';

const storage = new BrowserPersistence();

export const useCustomerDetails = () => {
    const [, userApi] = useUserContext();

    const { loading, called } = useQuery(GET_CUSTOMER_DATA, {
        fetchPolicy: 'cache-and-network',
        skip: !storage.getItem('signin_token')
    });

    const fetchUserDetails = useAwaitQuery(GET_CUSTOMER_DATA);

    useEffect(() => {
        if (!called || loading) {
            return;
        }
        userApi.getUserDetails({ fetchUserDetails });
    }, [called, loading, fetchUserDetails, userApi]);
};
