import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { AddressBook } from '@app/components/AccountDashboard/AccountInformation/addressBook';
import RecentOrders from '@app/components/AccountDashboard/RecentOrders/recentOrders';
import RecentReviews from '@app/components/AccountDashboard/RecentReviews/recentReviews';
import { useDashboard } from '@app/components/AccountDashboard/useDashboard';
import AccountPageWrapper from '@app/components/AccountPageWrapper';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './accountDashboard.module.css';
import { DeleteAccount } from './DeleteAccount/deleteAccount';

const AccountDashboard = () => {
    const { formatMessage } = useIntl();

    const {
        currentUser,
        orders,
        isLoadingWithoutData,
        productReviews,
        isBackgroundLoading,
        customerAddresses,
        countryDisplayNameMap
    } = useDashboard();

    const maybeRecentReviews = productReviews.length ? (
        <RecentReviews productReviews={productReviews} isLoadingWithoutData={isLoadingWithoutData} />
    ) : null;

    const maybeRecentOrders = orders.length ? (
        <RecentOrders
            orders={orders}
            isLoadingWithoutData={isLoadingWithoutData}
            isBackgroundLoading={isBackgroundLoading}
        />
    ) : null;

    const subscriptionText = currentUser.is_subscribed ? (
        <FormattedMessage
            id="accountDashboardPage.accountNewsletterTextSubscribed"
            defaultMessage='You are subscribed to "General Subscription".'
        />
    ) : (
        <FormattedMessage
            id="accountDashboardPage.accountNewsletterTextNotSubscribed"
            defaultMessage='You are not subscribed to "General Subscription"'
        />
    );

    const content = !isLoadingWithoutData ? (
        <>
            {maybeRecentOrders}
            <div className={classes.title} data-cy="AccountInformationPage-title">
                <h2>
                    <FormattedMessage id="accountInformationPage.accountInformationTitle" defaultMessage="Account" />
                </h2>
                <h2>
                    <FormattedMessage
                        id="accountInformationPage.accountInformationSecondary"
                        defaultMessage="Information"
                    />
                </h2>
            </div>
            <div className={classes.content}>
                <div className={classes.contactInformationWrapper}>
                    <div className={classes.contactTitle}>
                        <h4>
                            <FormattedMessage
                                id="accountDashboardPage.accountInformationTitle"
                                defaultMessage="Contact"
                            />
                        </h4>
                        <h4>
                            <FormattedMessage
                                id="accountDashboardPage.accountInformationSecondary"
                                defaultMessage="Information"
                            />
                        </h4>
                    </div>
                    <div>
                        <div className={classes.name}>{currentUser.firstname + ' ' + currentUser.lastname}</div>
                        <div className={classes.email}>{currentUser.email}</div>
                    </div>
                    <div className={classes.action}>
                        <Link to="/account-information">
                            <FormattedMessage id="accountDashboardPage.accountEdit" defaultMessage="Edit" />
                        </Link>
                        <Link to="/account-information">
                            <FormattedMessage
                                id="accountDashboardPage.accountChangePassword"
                                defaultMessage="Change Password"
                            />
                        </Link>
                    </div>
                </div>
                <div className={classes.newslettersWrapper}>
                    <h4 className={classes.title}>
                        <FormattedMessage id="accountDashboardPage.newsletterTitle" defaultMessage="Newsletters" />
                    </h4>
                    <div className={classes.subscriptionText}>{subscriptionText}</div>
                    <Link className={classes.action} to="/communications">
                        <FormattedMessage id="accountDashboardPage.newsletterEdit" defaultMessage="Edit" />
                    </Link>
                </div>
                <AddressBook customerAddresses={customerAddresses} countryDisplayNameMap={countryDisplayNameMap} />
                <DeleteAccount />
            </div>
            {maybeRecentReviews}
        </>
    ) : (
        <LoadingIndicator>
            <FormattedMessage id="accountDashboardPage.loading" defaultMessage="Loading Account Information" />
        </LoadingIndicator>
    );

    return (
        <AccountPageWrapper>
            <StoreTitle>
                {formatMessage({
                    id: 'accountDashboard.storeTitle',
                    defaultMessage: 'Account Dashboard'
                })}
            </StoreTitle>
            {content}
        </AccountPageWrapper>
    );
};

export default AccountDashboard;
