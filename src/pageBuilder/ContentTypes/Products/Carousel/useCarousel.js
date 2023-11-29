import { useQuery } from '@apollo/client';

import { useCustomerWishlistSkus } from '@app/hooks/useCustomerWishlistSkus';
import defaultOperations from '@magento/pagebuilder/lib/ContentTypes/Products/Carousel/carousel.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 * This is a duplicate of @magento/peregrine/lib/talons/Gallery/useGallery.js
 */
export const useCarousel = (props = {}) => {
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
