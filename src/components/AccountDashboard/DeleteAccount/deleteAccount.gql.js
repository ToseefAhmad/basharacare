import { gql } from '@apollo/client';

export const DELETE_CUSTOMER_ACCOUNT = gql`
    mutation DeleteCustomerAccount {
        deleteCustomer
    }
`;
