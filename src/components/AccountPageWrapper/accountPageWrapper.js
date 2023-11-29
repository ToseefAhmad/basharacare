import { node, string } from 'prop-types';
import React, { useEffect, useRef } from 'react';
import { Circle } from 'react-feather';
import { FormattedMessage } from 'react-intl';
const FormattedMessageDynamic = FormattedMessage;
import { Link } from 'react-router-dom';

import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './accountPageWrapper.module.css';
import { useAccountPageWrapper } from './useAccountPageWrapper.js';

const ACCOUNT_MENU_ITEMS = [
    {
        name: 'Account Dashboard',
        id: 'accountPageWrapper.accountDashbord',
        url: '/account-dashboard'
    },
    {
        name: 'Account Information',
        id: 'accountPageWrapper.account',
        url: '/account-information'
    },
    {
        name: 'My Personalized Routine',
        id: 'accountPageWrapper.personalRoutine',
        url: '/personalized-routine'
    },
    {
        name: 'Address Book',
        id: 'accountPageWrapper.addressBook',
        url: '/address-book'
    },
    {
        name: 'My Orders',
        id: 'accountPageWrapper.orders',
        url: '/order-history'
    },
    {
        name: 'Newsletter Subscriptions',
        id: 'accountPageWrapper.newsLetterSubscriptions',
        url: '/communications'
    },
    {
        name: 'My Wish List',
        id: 'accountPageWrapper.wishList',
        url: '/wishlist'
    },
    {
        name: 'My Product Reviews',
        id: 'accountPageWrapper.productReviews',
        url: '/reviews'
    },
    {
        name: 'Store Credit',
        id: 'accountPageWrapper.storeCredit',
        url: '/store-credit'
    },
    {
        name: 'My Reward Points',
        id: 'accountPageWrapper.rewardPoints',
        url: '/rewards-account'
    },
    {
        name: 'My Referrals',
        id: 'accountPageWrapper.referrals',
        url: '/rewards-account/referrals'
    }
];

const AccountPageWrapper = ({ children }) => {
    const { pathname } = useAccountPageWrapper();

    const pageTitle = (
        <>
            <h1>
                <FormattedMessage id="accountInformationPage.titleMyAccount" defaultMessage="My" />
            </h1>
            <h1 className={classes.headingRegular}>
                <FormattedMessage id="accountInformationPage.titleMyAccountSecondary" defaultMessage="Account" />
            </h1>
        </>
    );

    useEffect(() => {
        document.body.classList.add('my-account');
        return () => {
            document.body.classList.remove('my-account');
        };
    }, []);

    const titleRef = useRef();
    useEffect(() => {
        setTimeout(() => {
            titleRef && titleRef?.current?.scrollIntoView({ scroll: 'smooth', inline: 'start', block: 'end' });
        }, 500);
    }, [titleRef]);

    const accountMenuItems = ACCOUNT_MENU_ITEMS.map(item => {
        const activeRef = pathname === item.url ? titleRef : null;
        const activeCircleIcon =
            pathname === item.url ? (
                <Icon
                    classes={{ icon: classes.circleIcon }}
                    src={Circle}
                    attrs={{
                        width: 5
                    }}
                />
            ) : null;

        return (
            <li key={item.id} ref={activeRef} className={classes.listItem}>
                <Link
                    className={pathname.includes(item.url) ? classes.menuItemActive : classes.menuItem}
                    key={item.id}
                    to={item.url}
                >
                    <FormattedMessageDynamic id={item.id} defaultMessage={item.name} />
                    {activeCircleIcon}
                </Link>
            </li>
        );
    });

    const accountMenu = <ul key="accountMenu">{accountMenuItems}</ul>;

    return (
        <div className={classes.root}>
            <div className={classes.headerContentWrapper}>
                <div className={classes.headerContent}>
                    <div className={classes.title}>{pageTitle}</div>
                    <div className={classes.accountMenuWrapper}>
                        <div className={classes.accountMenu}>{accountMenu}</div>
                        <div className={classes.accountMenuOverlayRight} />
                        <div className={classes.accountMenuOverlayLeft} />
                    </div>
                </div>
            </div>
            <div className={classes.content}>{children}</div>
        </div>
    );
};

export default AccountPageWrapper;

AccountPageWrapper.propTypes = {
    children: node,
    pageTitle: string
};
