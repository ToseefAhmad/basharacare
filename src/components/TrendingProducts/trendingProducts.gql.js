import { gql } from '@apollo/client';

import { ProductsFragment } from '@app/RootComponents/Category/categoryFragments.gql';

export const GET_TRENDING_PRODUCTS = gql`
    query getTrendingProducts {
        trendingProducts {
            slider_title #Slider title
            ...ProductsFragment
        }
    }
    ${ProductsFragment}
`;
