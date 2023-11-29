import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import DEFAULT_OPERATIONS from '@app/components/RewardsAccount/RewardCode/rewardCode.gql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useRewardCode = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getAppliedRewardCodesQuery, applyRewardCodeMutation, removeRewardCodeMutation } = operations;
    const { setIsCartUpdating, rewardCode, useMaxRewardCode } = props;

    const [{ cartId }] = useCartContext();
    const { data, error: fetchError } = useQuery(getAppliedRewardCodesQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: {
            cartId
        }
    });

    const [sendRewardCode, setSendRewardCode] = useState(false);

    const [
        applyRewardCode,
        { called: applyRewardCodeCalled, error: applyError, loading: applyingRewardCode }
    ] = useMutation(applyRewardCodeMutation);

    const [
        removeRewardCode,
        { called: removeRewardCodeCalled, error: removeRewardCodeError, loading: removingRewardCode }
    ] = useMutation(removeRewardCodeMutation);

    let spendPoints = rewardCode;
    let maxPoints;
    if (data && data.cart && data.cart.applied_rewards) {
        const { spend_max_points, spend } = data.cart.applied_rewards;
        maxPoints = spend_max_points;
        spendPoints = spend;
    }
    const formApiRef = useRef(null);
    const setFormApi = useCallback(api => (formApiRef.current = api), []);
    const [initialValues] = useState({
        rewardCode: useMaxRewardCode && maxPoints ? maxPoints : spendPoints,
        useMaxRewardCode: maxPoints === spendPoints
    });

    const formUpdate = useCallback(
        (rewardCode, useMaxRewardCode) => {
            const updateValues = {
                rewardCode: rewardCode,
                useMaxRewardCode: useMaxRewardCode
            };
            updateValues.rewardCode = useMaxRewardCode && maxPoints ? maxPoints : rewardCode;
            formApiRef.current.setValues(updateValues);
        },
        [maxPoints]
    );

    const handleSubmit = useCallback(
        async ({ rewardCode }) => {
            if (!rewardCode) return;
            setSendRewardCode(true);
            try {
                await applyRewardCode({
                    variables: {
                        cartId,
                        rewardCode
                    }
                });
            } catch (e) {
                // Error is logged by apollo link - no need to double log.
            }
            setSendRewardCode(false);
        },
        [applyRewardCode, cartId]
    );

    const handleRemove = useCallback(
        async rewardCode => {
            try {
                await removeRewardCode({
                    variables: {
                        cartId,
                        rewardCode
                    }
                });
            } catch (e) {
                // Error is logged by apollo link - no need to double log.
            }
        },
        [cartId, removeRewardCode]
    );

    useEffect(() => {
        if (applyRewardCodeCalled || removeRewardCodeCalled) {
            setIsCartUpdating(applyingRewardCode || removingRewardCode);
            formUpdate(useMaxRewardCode && maxPoints ? maxPoints : spendPoints, maxPoints === spendPoints);
        }
    }, [
        applyRewardCodeCalled,
        applyingRewardCode,
        formUpdate,
        maxPoints,
        removeRewardCodeCalled,
        removingRewardCode,
        setIsCartUpdating,
        spendPoints,
        useMaxRewardCode
    ]);

    const errors = useMemo(
        () =>
            new Map([
                ['getAppliedRewardCodesQuery', fetchError],
                ['applyRewardCodeMutation', applyError],
                ['removeRewardCodeMutation', removeRewardCodeError]
            ]),
        [applyError, fetchError, removeRewardCodeError]
    );

    const handleChange = useCallback(
        ({ rewardCode, useMaxRewardCode }) => {
            formUpdate(rewardCode, useMaxRewardCode);
        },
        [formUpdate]
    );

    return {
        setFormApi,
        initialValues,
        applyingRewardCode,
        data,
        errors,
        handleChange,
        handleSubmit,
        handleRemove,
        removingRewardCode,
        isSendRewardCode: sendRewardCode
    };
};
