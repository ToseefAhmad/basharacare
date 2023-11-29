import { useQuery } from '@apollo/client';

import DEFAULT_OPERATIONS from './instagramFeed.gql';

export const useInstagramFeed = () => {
    const { getInstagramFeed } = DEFAULT_OPERATIONS;

    const { data } = useQuery(getInstagramFeed, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            sort: '0',
            postLimit: '8'
        }
    });

    const items = data?.instagramFeed?.posts || [];

    return { items };
};
