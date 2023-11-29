import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { GET_TABBY_CONFIG } from './tabbyPromo.gql';

export const useTabbyPromo = () => {
    const { data, loading } = useQuery(GET_TABBY_CONFIG);

    const publicKey = useMemo(() => {
        return data && data.storeConfig && data.storeConfig.tabby_public_key;
    }, [data]);

    const isEnabled = useMemo(() => {
        if (loading) {
            return false;
        }
        return (
            data && data.storeConfig && data.storeConfig.tabby_installments_enabled && data.storeConfig.tabby_public_key
        );
    }, [data, loading]);

    return {
        publicKey,
        isEnabled,
        isLoadingConfig: loading
    };
};
