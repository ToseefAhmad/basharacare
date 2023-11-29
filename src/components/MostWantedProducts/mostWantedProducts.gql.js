import { gql } from '@apollo/client';

import { ProductsFragment } from '@app/RootComponents/Category/categoryFragments.gql';

export const GET_BEST_SELLERS = gql`
    query getBestsellersProducts {
        bestsellersProducts {
            slider_title #Slider title
            ...ProductsFragment
        }
    }
    ${ProductsFragment}
`;
