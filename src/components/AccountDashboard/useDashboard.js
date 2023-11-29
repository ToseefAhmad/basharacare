import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';

import { GET_CUSTOMER_DETAILS } from './accountDashboard.gql.js';

export const useDashboard = () => {
    const [{ isSignedIn }] = useUserContext();

    const [{ currentUser }] = useUserContext();
    const { data: customerDetailsData, loading: customerDetailsLoading } = useQuery(GET_CUSTOMER_DETAILS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn
    });

    const isLoadingWithoutData = !customerDetailsData && customerDetailsLoading;
    const isBackgroundLoading = !!customerDetailsData && customerDetailsLoading;

    const customerAddresses = useMemo(() => (customerDetailsData && customerDetailsData.customer.addresses) || [], [
        customerDetailsData
    ]);

    const orders = useMemo(() => (customerDetailsData && customerDetailsData.customer.orders.items) || [], [
        customerDetailsData
    ]);

    const productReviews = useMemo(() => (customerDetailsData && customerDetailsData.customer.reviews.items) || [], [
        customerDetailsData
    ]);

    const countryDisplayNameMap = useMemo(() => {
        const countryMap = new Map();

        if (customerDetailsData) {
            const { countries } = customerDetailsData;
            countries.forEach(country => {
                countryMap.set(country.id, country.full_name_locale);
            });
        }

        return countryMap;
    }, [customerDetailsData]);

    return {
        customerAddresses,
        isLoadingWithoutData,
        isBackgroundLoading,
        countryDisplayNameMap,
        orders,
        productReviews,
        currentUser
    };
};
