import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo, useRef } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import DEFAULT_OPERATIONS from '@app/components/RewardsAccount/rewardsAccount.gql';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

/**
 *
 * @param {*} props.operations GraphQL operations used by talons
 */
export const useRewardsAccount = (props = {}) => {
    const history = useHistory();
    const { push } = history;
    const [, { addToast }] = useToasts();
    const formApiRef = useRef(null);
    const { formatMessage } = useIntl();
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getRewardsQuery, rewardsMutation, getCustomerMyReferrals } = operations;

    const [submitForm, { data, error: contactError, loading: submitLoading }] = useMutation(rewardsMutation, {
        fetchPolicy: 'no-cache'
    });

    const { data: referralsHistory } = useQuery(getCustomerMyReferrals);

    const handleSubmit = useCallback(
        async ({ name, email, message }) => {
            try {
                const reset = await submitForm({
                    variables: {
                        name,
                        email,
                        message
                    }
                });
                if (reset.data.rewardForm.status) {
                    addToast({
                        type: 'success',
                        message: formatMessage(
                            {
                                id: 'RewardsAccount.subscriptionAdded',
                                defaultMessage: 'Customer with email {email} has been already invited to our store'
                            },
                            { email: email }
                        )
                    });
                }
                if (formApiRef.current) {
                    formApiRef.current.reset();
                }
                push('/rewards-account/referrals');
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }
            }
        },
        [addToast, formatMessage, push, submitForm]
    );

    const errors = useMemo(() => new Map([['rewardsMutation', contactError]]), [contactError]);

    const { data: rewardsData } = useQuery(getRewardsQuery);

    const referralsItems = useMemo(() => {
        return referralsHistory?.customer?.referrals_items || [];
    }, [referralsHistory]);

    return {
        referralsItems,
        setFormApi,
        handleSubmit,
        errors,
        isBusy: submitLoading,
        response: data && data.rewardForm,
        amount: rewardsData && rewardsData.reward && rewardsData.reward.amount,
        history: rewardsData && rewardsData.reward && rewardsData.reward.history
    };
};

useRewardsAccount.defaultProps = {
    triggerUpdate: () => {}
};
