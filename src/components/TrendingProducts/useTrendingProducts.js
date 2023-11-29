import { useQuery } from '@apollo/client';

import { GET_TRENDING_PRODUCTS } from './trendingProducts.gql';

export const useTrendingProducts = () => {
    const { data: trendingProductsData } = useQuery(GET_TRENDING_PRODUCTS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const products = trendingProductsData ? trendingProductsData.trendingProducts.items : null;

    return { products };
};
