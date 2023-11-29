import { bool, func, shape, string } from 'prop-types';
import React from 'react';
import { ArrowRight as ArrowRightIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import { useAuthBar } from '@magento/peregrine/lib/talons/AuthBar/useAuthBar';
import { useStyle } from '@magento/venia-ui/lib/classify';
import AccountChip from '@magento/venia-ui/lib/components/AccountChip';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './authBar.module.css';

const AuthBar = ({ noChip, ...props }) => {
    const { handleShowMyAccount, handleSignIn, isDisabled, isUserSignedIn } = useAuthBar(props);
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const fallBackText = formatMessage({
        id: 'authBar.fallbackText',
        defaultMessage: 'Account'
    });

    const buttonElement = isUserSignedIn ? (
        // Show My Account button.
        <button className={classes.button} disabled={isDisabled} onClick={handleShowMyAccount}>
            <span className={classes.contents}>
                <AccountChip fallbackText={fallBackText} />
                <span className={classes.icon}>
                    <Icon src={ArrowRightIcon} />
                </span>
            </span>
        </button>
    ) : (
        // Sign In button.
        <button className={classes.button} disabled={isDisabled} onClick={handleSignIn}>
            <span className={classes.contents}>
                {!noChip && <AccountChip fallbackText={fallBackText} />}
                <span className={classes.signIn}>
                    <FormattedMessage id="authBar.login" defaultMessage="Log in / Register" />
                </span>
            </span>
        </button>
    );

    return <div className={classes.root}>{buttonElement}</div>;
};

export default AuthBar;

AuthBar.propTypes = {
    classes: shape({
        root: string,
        button: string,
        contents: string,
        icon: string,
        signIn: string
    }),
    disabled: bool,
    showMyAccount: func.isRequired,
    showSignIn: func.isRequired
};
