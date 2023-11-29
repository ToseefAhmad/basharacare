import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import defaultOperations from './search.gql';

export const useSearch = () => {
    const { getAlgoliaConfig } = defaultOperations;

    const { data: algoliaConfig } = useQuery(getAlgoliaConfig);

    const filterAttributes = useMemo(() => {
        return algoliaConfig?.getAlgoliaConfig?.facets;
    }, [algoliaConfig]);

    const sortingItems = useMemo(() => {
        return algoliaConfig?.getAlgoliaConfig?.sorting;
    }, [algoliaConfig]);

    const numberOfProducts = useMemo(() => {
        return algoliaConfig?.getAlgoliaConfig?.numberOfProducts || 30;
    }, [algoliaConfig]);

    return {
        filterAttributes,
        sortingItems,
        numberOfProducts
    };
};
