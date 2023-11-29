import { useLazyQuery, useQuery } from '@apollo/client';
import { useEffect, useMemo } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './productLabels.ggl';

export const useLabels = props => {
    const { products, productsFromVariants, mode } = props;
    const [{ isSignedIn }] = useUserContext();
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getLabelSettingQuery, getLabelsQuery } = operations;

    const productIds = useMemo(() => {
        if (Array.isArray(products)) {
            return products.map(product => !!product && product.id);
        } else if (products.variants) {
            return productsFromVariants.length ? [productsFromVariants[0]] : [products.id];
        } else {
            return [products.id];
        }
    }, [products, productsFromVariants]);

    const { loading: settingLoading, data: settingData } = useQuery(getLabelSettingQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const { amLabelSetting: labelSetting } = settingData || {};

    const [loadQuery, { loading, error, data }] = useLazyQuery(getLabelsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    useEffect(() => {
        loadQuery({
            variables: {
                productIds,
                mode
            },
            skip: productIds.length < 1
        });
    }, [productIds, mode, loadQuery, isSignedIn]);

    const { amLabelProvider = [] } = data || {};

    const labels = useMemo(() => {
        return amLabelProvider.length
            ? mode === 'PRODUCT'
                ? amLabelProvider[0]
                : amLabelProvider.reduce((acc, item) => {
                      const { items } = item;
                      const productId = items && items[0] && items[0].product_id;

                      if (productId) {
                          acc[productId] = item;
                      }
                      return acc;
                  }, {})
            : {};
    }, [amLabelProvider, mode]);

    const shouldShowLoading = useMemo(() => {
        return (loading || settingLoading) && (!productsFromVariants || !productsFromVariants.length);
    }, [loading, productsFromVariants, settingLoading]);

    return {
        error,
        shouldShowLoading,
        loading,
        labels,
        labelSetting,
        mode
    };
};
