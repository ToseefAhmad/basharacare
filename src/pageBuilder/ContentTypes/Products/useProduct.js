import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import { GET_PRODUCTS_BY_URL_KEY, GET_STORE_CONFIG_DATA } from '@app/pageBuilder/ContentTypes/Products/products.gql';

const restoreSortOrder = (urlKeys, products) => {
    if (!products) {
        return [];
    }
    const productsByOriginalOrder = new Map();
    products.forEach(product => {
        productsByOriginalOrder.set(product.url_key, product);
    });
    return urlKeys.map(urlKey => productsByOriginalOrder.get(urlKey)).filter(Boolean);
};

const useProduct = props => {
    const { pathNames = [] } = props;

    const { data: storeConfigData } = useQuery(GET_STORE_CONFIG_DATA, {
        fetchPolicy: 'cache-only'
    });

    const productUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.product_url_suffix;
        }
    }, [storeConfigData]);

    const urlKeys = pathNames.map(pathName => {
        const slug = pathName
            .replace(/\/+$/, '')
            .split('/')
            .pop();
        return productUrlSuffix ? slug.replace(productUrlSuffix, '') : slug;
    });

    const { loading, error, data } = useQuery(GET_PRODUCTS_BY_URL_KEY, {
        variables: { url_keys: urlKeys, pageSize: urlKeys.length }
    });

    const items = restoreSortOrder(urlKeys, data?.products?.items);

    return {
        error,
        loading,
        items
    };
};
export default useProduct;
