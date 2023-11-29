import React, { useCallback, useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';

import CmsBlock from '@app/components/overrides/CmsBlock';
import Forms from '@app/components/RewardsAccount/forms';
import { useRewardsAccount } from '@app/components/RewardsAccount/useRewardsAccount';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './rewardsAccount.module.css';

const RewardsAccount = () => {
    const { amount, history } = useRewardsAccount();
    const getDate = timestamp => {
        const separatedTimeAndDate = timestamp.split(' ');
        const dateArray = separatedTimeAndDate[0].split('-');

        return dateArray.join('/');
    };

    const listGroups =
        history &&
        Array.from(history, ({ created_at, amount }) => {
            return (
                <li key={created_at}>
                    <span>{getDate(created_at)}</span>
                    <span className={classes.historyPoints}>
                        <FormattedMessage
                            id="rewardPage.RewardsPointsCount"
                            defaultMessage={` ${amount} Points`}
                            values={{ amount: amount }}
                        />
                    </span>
                </li>
            );
        });

    const cmsBlock = (
        <CmsBlock
            shimmer={<Shimmer height={80} width="100%" />}
            identifiers="reward-points-main-block"
            classes={{ root: classes.cmsBlockRoot }}
        />
    );

    const removeBodyClass = useCallback(() => globalThis.document.body.classList.remove('cms-reward-points'), []);

    setTimeout(() => {
        const rewardsPointsAmount = document.getElementById('reward-points-amounts');
        const target = document.getElementsByClassName('reward-points-info-blockOne')[0];
        target && target.appendChild(rewardsPointsAmount);
    }, 200);

    useEffect(() => {
        document.body.classList.add('cms-reward-points');
        return removeBodyClass;
    }, [removeBodyClass]);

    const wrapperRef = useRef();

    return (
        <div className={classes.root} ref={wrapperRef}>
            {cmsBlock}
            <div id="reward-points-amounts" className={classes.rewardsPointsWrapper}>
                <div className={classes.rewardPointsTitle}>
                    <h3>
                        <FormattedMessage id="rewardPage.infoTextFirst" defaultMessage="My" />
                    </h3>
                    <h3>
                        <FormattedMessage id="rewardPage.infoTextSecondary" defaultMessage="Points: " />
                    </h3>
                </div>
                <span className={classes.pointAmount}>{amount}</span>
            </div>
            <div>
                <div className={classes.historyTitle}>
                    <h4>
                        <FormattedMessage id="rewardPage.historyHeadingText" defaultMessage="History of crediting" />
                    </h4>
                    <h4>
                        <FormattedMessage id="rewardPage.historyTextSecondary" defaultMessage="bonuses" />
                    </h4>
                </div>

                <ul className={classes.creditingHistory}>{listGroups}</ul>
            </div>
            <div className={classes.referralsWrapper}>
                <Forms classes={{ root: classes.form }} />
                <div className={classes.referralsImage}>
                    <img alt="delivery" src="/pwa/static-files/about-min.png" loading="lazy" />
                </div>
            </div>
        </div>
    );
};

export default RewardsAccount;
