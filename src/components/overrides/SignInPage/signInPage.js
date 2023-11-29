import { shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Register from '@app/components/overrides/SignInPage/Register/register';
import { useSignInPage } from '@magento/peregrine/lib/talons/SignInPage/useSignInPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Link from '@magento/venia-ui/lib/components/Link';

import SignIn from './SignIn';
import defaultClasses from './signInPage.module.css';

const SignInPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { signInProps } = useSignInPage(props);
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'signInPage.title',
                    defaultMessage: 'Sign In'
                })}
            </StoreTitle>
            <div className={classes.title} data-cy="AccountInformationPage-title">
                <h1>
                    <FormattedMessage id="signInPage.Title" defaultMessage="Customer" />
                </h1>
                <h1>
                    <FormattedMessage id="signInPage.titleSecondary" defaultMessage="Login" />
                </h1>
            </div>
            <div className={classes.noticeMessageRewards}>
                <FormattedMessage
                    id="signInPage.createAccountRewardsPointsText"
                    defaultMessage="Create an account on our site now and earn 100 Reward points"
                />

                <Link to="/reward-points">
                    <FormattedMessage id="signInPage.learMoreText" defaultMessage="Learn More" />
                </Link>
            </div>
            <div className={classes.noticeMessageSubscribe}>
                <FormattedMessage
                    id="signInPage.createAccountSubscribeText"
                    defaultMessage="Subscribe to our newsletter now and earn 200 Reward points."
                />

                <Link to="/reward-points">
                    <FormattedMessage id="signInPage.learMoreText" defaultMessage="Learn More" />
                </Link>
            </div>
            <div className={classes.contentContainer}>
                <SignIn {...signInProps} />
                <Register />
            </div>
        </div>
    );
};

SignInPage.defaultProps = {
    createAccountPageUrl: '/create-account',
    forgotPasswordPageUrl: '/forgot-password',
    signedInRedirectUrl: '/account-dashboard'
};

SignInPage.propTypes = {
    classes: shape({
        root: string,
        header: string,
        contentContainer: string
    }),
    createAccountPageUrl: string,
    forgotPasswordPageUrl: string,
    signedInRedirectUrl: string
};

export default SignInPage;
