import { useQuery } from '@apollo/client';

import DEFAULT_OPERATIONS from './brandsSlider.gql';

export const useBrandsSlider = ({ linkPath, showItems }) => {
    const { getShopBrands } = DEFAULT_OPERATIONS;

    const { data, loading: isLoading } = useQuery(getShopBrands, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            identifier: linkPath || 'brand'
        }
    });

    const brands = data?.shopByAttribute?.items || [];
    const allBrands = data?.shopByAttribute?.url_page || '/';
    const items = brands.filter(item => item.is_show_in_slider === '1').slice(0, showItems);

    return { items, allBrands, isLoading };
};
