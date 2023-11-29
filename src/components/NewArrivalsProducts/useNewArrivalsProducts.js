import { useQuery } from '@apollo/client';

import { GET_NEW_ARRIVALS } from './newArrivalsProducts.gql';

export const useNewArrivalsProducts = props => {
    const optionId = props ? props.optionId : '';

    const { data: newArrivalsProductsData } = useQuery(GET_NEW_ARRIVALS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            optionId: optionId
        }
    });

    const products = newArrivalsProductsData ? newArrivalsProductsData.newArrivalsProducts.items : null;

    return { products };
};
