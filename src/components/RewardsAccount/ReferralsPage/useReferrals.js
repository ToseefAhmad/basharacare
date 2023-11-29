import { useQuery } from '@apollo/client';
import { useMemo } from 'react';

import DEFAULT_OPERATIONS from '@app/components/RewardsAccount/rewardsAccount.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 *
 * @param props
 * @returns {{referralsItems: unknown}}
 */
export const useReferrals = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getCustomerMyReferrals } = operations;

    const { data: referralsHistory, loading: isLoading } = useQuery(getCustomerMyReferrals, {
        fetchPolicy: 'cache-and-network'
    });

    const referralsItems = useMemo(() => {
        return referralsHistory?.customer?.referrals_items || [];
    }, [referralsHistory]);

    return {
        isLoading,
        referralsItems
    };
};
