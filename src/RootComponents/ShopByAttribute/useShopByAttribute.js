import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './shopByAttribute.gql';

/**
 *
 * @param props
 * @returns {{error: ApolloError, loading: boolean, content: unknown}}
 */
export const useShopByAttribute = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getShopByAttributeDataQuery } = operations;

    const { error, loading, data } = useQuery(getShopByAttributeDataQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            identifier: props.url_page
        }
    });

    const content = useMemo(() => {
        if (!data) {
            // The product isn't in the cache and we don't have a response from GraphQL yet.
            return null;
        }

        // Only return the product that we queried for.
        const content = data.shopByAttribute.items.reduce((r, e) => {
            const group = e.label[0].toLocaleUpperCase();
            if (!r[group]) r[group] = { group, children: [e] };
            else r[group].children.push(e);
            return r;
        }, {});

        if (!content) {
            return null;
        }

        return content;
    }, [data]);

    const hreflangLinks =
        data && data.shopByAttribute && data.shopByAttribute.hreflang_links ? data.shopByAttribute.hreflang_links : [];

    const canonicalUrl = data && data.shopByAttribute.canonical_url ? data.shopByAttribute.canonical_url : '';

    const richData = data?.shopByAttribute?.rich_data || {};

    return {
        error,
        loading,
        content,
        hreflangLinks,
        canonicalUrl,
        richData
    };
};
