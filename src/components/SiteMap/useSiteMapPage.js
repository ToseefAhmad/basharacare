import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import DEFAULT_OPERATIONS from '@app/components/SiteMap/siteMapPage.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 *
 * @param props
 * @returns {{items: {columns, title: *, key: *}[]}}
 */
export const useSiteMapPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getSitemap } = operations;
    const { data } = useQuery(getSitemap, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const items = useMemo(() => {
        const keys = data?.sitemap || {};

        const itemsData = Object.keys(keys)
            .filter(key => key !== '__typename')
            .map(key => {
                const collection = JSON.parse(keys[key]);
                const { title, items, sort_position } = collection || {};
                return {
                    key: key,
                    title: title,
                    columns: items || [],
                    sort_position: sort_position
                };
            })
            .filter(item => {
                if (item.columns.length) {
                    return item;
                }
            });

        return itemsData.sort((a, b) => (a.sort_position > b.sort_position ? 1 : -1));
    }, [data]);

    const title = data?.storeConfig?.amseohtmlsitemap_title || '';
    const meta_description = data?.storeConfig?.amseohtmlsitemap_meta_description || '';

    return {
        title,
        meta_description,
        items
    };
};
