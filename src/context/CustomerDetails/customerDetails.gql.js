import { gql } from '@apollo/client';

import { CUSTOMER_DATA_FRAGMENT } from './customerDetailsFragment.gql';

export const GET_CUSTOMER_DATA = gql`
    query GetCustomerData {
        customer {
            id
            ...CustomerDataFragment
        }
    }
    ${CUSTOMER_DATA_FRAGMENT}
`;
