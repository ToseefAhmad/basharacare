import { gql } from '@apollo/client';

export const GET_STORE_CREDIT = gql`
    query GetStoreCredit {
        customer {
            credit {
                balance {
                    amount {
                        value
                        currency
                    }
                    currency_code
                    hasSeveralBalances
                }
                isSubscribed
                transactions {
                    transaction_id
                    balance_amount {
                        value
                        currency
                    }
                    balance_delta {
                        value
                        currency
                    }
                    action
                    message
                    is_notified
                    created_at
                    currency_code
                }
            }
        }
    }
`;

export const CHANGE_CUSTOMER_CREDIT_SUBSCRIPTION = gql`
    mutation ChangeCustomerCreditSubscription($isSubscribed: Boolean!) {
        changeCustomerCreditSubscription(isSubscribed: $isSubscribed) {
            success
        }
    }
`;
