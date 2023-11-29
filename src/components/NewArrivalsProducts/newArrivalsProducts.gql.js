import { gql } from '@apollo/client';

import { ProductsFragment } from '@app/RootComponents/Category/categoryFragments.gql';

export const GET_NEW_ARRIVALS = gql`
    query getNewArrivalsProducts($optionId: String) {
        newArrivalsProducts(optionId: $optionId) {
            slider_title #Slider title
            ...ProductsFragment
        }
    }
    ${ProductsFragment}
`;
