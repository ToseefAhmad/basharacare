import { useQuery } from '@apollo/client';

import { GET_BEST_SELLERS } from './mostWantedProducts.gql';

export const useMostWantedProducts = () => {
    const { data: mostWantedProductsData } = useQuery(GET_BEST_SELLERS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const bestsellersProducts = mostWantedProductsData ? mostWantedProductsData.bestsellersProducts.items : [];

    const removeDuplicateProductsByID = products => {
        const uniqueProducts = {};
        products.forEach(product => {
            uniqueProducts[product.id] = product;
        });
        return Object.values(uniqueProducts);
    };

    const uniqueProducts = removeDuplicateProductsByID(bestsellersProducts);

    const sortDescendingByItemsSold = (a, b) => {
        if (a.items_sold > b.items_sold) {
            return -1;
        }
        if (a.items_sold < b.items_sold) {
            return 1;
        }
        return 0;
    };

    const products = [...uniqueProducts].sort(sortDescendingByItemsSold);

    return { products };
};
