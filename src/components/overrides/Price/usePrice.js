import { useQuery } from '@apollo/client';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './price.gql';

/**
 *
 * @param props
 * @returns {{storeConfig: *}}
 */
export const usePrice = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);

    const { data: storeConfigData } = useQuery(operations.getStoreConfigQuery, {
        fetchPolicy: 'cache-first'
    });

    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    return {
        storeConfig
    };
};
