import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useReferrals } from '@app/components/RewardsAccount/ReferralsPage/useReferrals';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './referrals.module.css';

const ReferralsTable = () => {
    const { referralsItems, isLoading } = useReferrals();

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id="referralsTable.loading" defaultMessage="Loading Referrals Table" />
            </LoadingIndicator>
        );
    }

    const referralsElement =
        referralsItems &&
        Array.from(referralsItems, ({ email, name, status_name, points_amount }) => {
            return (
                <li key={email} className={classes.tableItem}>
                    <div className={classes.tableRow}>
                        <span className={classes.tableItemLabel}>
                            <FormattedMessage id="ReferralsPage.NameLabel" defaultMessage="Name" />
                        </span>
                        <span className={classes.tableItemValue}>{name}</span>
                    </div>
                    <div className={classes.tableRow}>
                        <span className={classes.tableItemLabel}>
                            <FormattedMessage id="ReferralsPage.EmailLabel" defaultMessage="Email" />
                        </span>
                        <span className={classes.tableItemValue}>{email}</span>
                    </div>
                    <div className={classes.tableRow}>
                        <span className={classes.tableItemLabel}>
                            <FormattedMessage id="ReferralsPage.StatusLabel" defaultMessage="Status" />
                        </span>
                        <span className={classes.tableItemValue}>{status_name}</span>
                    </div>
                    <div className={classes.tableRow}>
                        <span className={classes.tableItemLabel}>
                            <FormattedMessage id="ReferralsPage.PointsLabel" defaultMessage="Points" />
                        </span>
                        <span className={classes.tableItemValue}>
                            {points_amount ? (
                                <FormattedMessage
                                    id="rewardPage.RewardsPointsCount"
                                    defaultMessage="{amount} Points"
                                    values={{ amount: points_amount }}
                                />
                            ) : (
                                '-'
                            )}
                        </span>
                    </div>
                </li>
            );
        });

    return (
        <>
            <div className={classes.tableHeader}>
                <span>
                    <FormattedMessage id="ReferralsPage.NameLabel" defaultMessage="Name" />
                </span>
                <span>
                    <FormattedMessage id="ReferralsPage.EmailLabel" defaultMessage="Email" />
                </span>
                <span>
                    <FormattedMessage id="ReferralsPage.StatusLabel" defaultMessage="Status" />
                </span>
                <span>
                    <FormattedMessage id="ReferralsPage.PointsLabel" defaultMessage="Points" />
                </span>
            </div>
            <ul className={classes.orderHistoryTable}>{referralsElement}</ul>
        </>
    );
};

export default ReferralsTable;
