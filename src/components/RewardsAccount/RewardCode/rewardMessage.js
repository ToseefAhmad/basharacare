import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useRewardCodeContext } from '@app/components/RewardsAccount/RewardCode/context';

import classes from './rewardCode.module.css';

const RewardMessage = () => {
    const talonProps = useRewardCodeContext();
    const { data } = talonProps;

    if (!data) {
        return null;
    }
    const { cart, reward } = data;

    return (
        <div>
            <div>
                <FormattedMessage
                    id="cartPage.rewardEarnPoints"
                    defaultMessage="Checkout now and earn {amount} Reward Points for this order."
                    values={{
                        b: chunks => <strong>{chunks}</strong>,
                        amount: cart.applied_rewards.earn_points || 0
                    }}
                />
            </div>
            <div className={classes.rewardMessageBalance}>
                <FormattedMessage
                    id="cartPage.earnPoints"
                    defaultMessage="Your balance is {amount} Reward Points"
                    values={{
                        amount: reward.amount || 0
                    }}
                />
            </div>
        </div>
    );
};

export default RewardMessage;
