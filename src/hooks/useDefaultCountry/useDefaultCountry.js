import { useQuery } from '@apollo/client';

import { GET_DEFAULT_COUNTRY } from './useDefaultCountry.gql';

export const useDefaultCountry = () => {
    const { data } = useQuery(GET_DEFAULT_COUNTRY, {
        fetchPolicy: 'cache-only'
    });

    return {
        defaultCountry: data?.storeConfig?.default_country
    };
};
