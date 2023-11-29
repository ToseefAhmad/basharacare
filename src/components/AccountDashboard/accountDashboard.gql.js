import { gql } from '@apollo/client';

import { CustomerAddressFragment, CustomerOrdersFragment } from './accountDashboardFragments.gql.js';

export const GET_CUSTOMER_DETAILS = gql`
    query GetCustomerDetails {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        customer {
            addresses {
                id
                ...CustomerAddressFragment
            }
            reviews(pageSize: 5) {
                items {
                    average_rating
                    product {
                        uid
                        name
                        url
                    }
                }
            }

            orders(filter: {}, pageSize: 4) {
                ...CustomerOrdersFragment
            }
        }
        countries {
            id
            full_name_locale
        }
    }
    ${CustomerAddressFragment}
    ${CustomerOrdersFragment}
`;

export const GET_COUNTRY_BY_ID = gql`
    query getCountryByQuery($country_code: String!) {
        country(id: $country_code) {
            id
            full_name_english
        }
    }
`;
