import { gql } from '@apollo/client';

export const GET_CATEGORY_AVAILABLE_SORT_METHODS = gql`
    query getCategoryAvailableSortMethods($categoryIdFilter: FilterEqualTypeInput!) {
        products(filter: { category_uid: $categoryIdFilter }) {
            sort_fields {
                options {
                    label
                    value
                }
            }
        }
    }
`;

export default {
    getCategoryAvailableSortMethodsQuery: GET_CATEGORY_AVAILABLE_SORT_METHODS
};
