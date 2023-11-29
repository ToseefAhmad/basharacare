import { useQuery, useLazyQuery } from '@apollo/client';
import { useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { useTracking } from '@app/hooks/useTracking';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';

import DEFAULT_OPERATIONS from './product.gql';

/**
 * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 * controls the logic for the Product Root Component.
 *
 * @kind function
 *
 * @param {object}      props
 * @param {Function}    props.mapProduct - A function for updating products to the proper shape.
 * @param {GraphQLAST}  props.queries.getStoreConfigData - Fetches storeConfig product url suffix using a server query
 * @param {GraphQLAST}  props.queries.getProductQuery - Fetches product using a server query
 *
 * @returns {object}    result
 * @returns {Bool}      result.error - Indicates a network error occurred.
 * @returns {Bool}      result.loading - Indicates the query is in flight.
 * @returns {Bool}      result.product - The product's details.
 */
export const useProduct = props => {
    const { mapProduct } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getStoreConfigData, getProductDetailQuery, getViewedProductsQuery, getProductTabsQuery } = operations;

    const initialized = useRef(false);
    const { pathname } = useLocation();
    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();
    const { trackProductView, getProductCategories } = useTracking();

    const { data: storeConfigData } = useQuery(getStoreConfigData, {
        fetchPolicy: 'cache-only'
    });

    const productUrlSuffix = useMemo(() => {
        if (storeConfigData) {
            return storeConfigData.storeConfig.product_url_suffix;
        }
    }, [storeConfigData]);

    const slug = pathname
        .replace(/\/+$/, '')
        .split('/')
        .pop();
    const urlKey = productUrlSuffix ? slug.replace(productUrlSuffix, '') : slug;

    const { error, loading, data } = useQuery(getProductDetailQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData,
        variables: {
            urlKey
        }
    });

    const isBackgroundLoading = !!data && loading;

    const [loadProductTabs, { data: productTabs }] = useLazyQuery(getProductTabsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const product = useMemo(() => {
        if (!data) {
            // The product isn't in the cache and we don't have a response from GraphQL yet.
            return null;
        }

        // Note: if a product is out of stock _and_ the backend specifies not to
        // Display OOS items, the items array will be empty.

        // Only return the product that we queried for.
        const product = data.products.items.find(item => item.url_key === urlKey);

        if (!product) {
            return null;
        }

        loadProductTabs({
            variables: {
                uid: product.uid
            }
        });

        return mapProduct(product);
    }, [loadProductTabs, data, mapProduct, urlKey]);

    const storage = new BrowserPersistence();
    const recentlyViewedProductsString = storage.getItem('RECENTLY_VIEWED_PRODUCTS');

    const recentlyViewedProductsArray = recentlyViewedProductsString ? recentlyViewedProductsString.split(',') : [];

    const { data: viewedProductsData } = useQuery(getViewedProductsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !storeConfigData,
        variables: {
            skuArray: recentlyViewedProductsArray
        }
    });

    const viewedProducts = useMemo(() => {
        if (!viewedProductsData) {
            return null;
        }

        return viewedProductsData.products.items;
    }, [viewedProductsData]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    useEffect(() => {
        if (!initialized.current && product) {
            initialized.current = true;

            trackProductView({
                product: {
                    name: product.name,
                    sku: product.sku,
                    price: product.price_range.maximum_price.final_price.value,
                    currency: product.price_range.maximum_price.final_price.currency,
                    category: getProductCategories(product.categories),
                    brand: product.brand_name
                }
            });
        }
    }, [getProductCategories, product, trackProductView]);

    return {
        error,
        loading,
        product,
        productTabs,
        viewedProducts
    };
};
