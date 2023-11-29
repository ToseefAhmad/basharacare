import { useQuery } from '@apollo/client';

import { useCustomerWishlistSkus } from '@app/hooks/useCustomerWishlistSkus';
import defaultOperations from '@magento/peregrine/lib/talons/Gallery/gallery.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useGallery = (props = {}) => {
    const operations = mergeOperations(defaultOperations, props.operations);

    useCustomerWishlistSkus();

    const { data: storeConfigData } = useQuery(operations.getStoreConfigQuery, {
        fetchPolicy: 'cache-only'
    });

    const storeConfig = storeConfigData ? storeConfigData.storeConfig : null;

    return {
        storeConfig
    };
};
