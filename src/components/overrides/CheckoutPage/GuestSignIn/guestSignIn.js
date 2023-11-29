import { bool, func, shape, string } from 'prop-types';
import React from 'react';
import { X } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import CreateAccount from '@app/components/overrides/CreateAccount';
import { useGuestSignIn } from '@magento/peregrine/lib/talons/CheckoutPage/GuestSignIn/useGuestSignIn';
import { useStyle } from '@magento/venia-ui/lib/classify';
import ForgotPassword from '@magento/venia-ui/lib/components/ForgotPassword';
import Icon from '@magento/venia-ui/lib/components/Icon';
import SignIn from '@magento/venia-ui/lib/components/SignIn';

import defaultClasses from './guestSignIn.module.css';

const GuestSignIn = props => {
    const { isActive, toggleActiveContent, initialValues, handleShowSignin } = props;

    const talonProps = useGuestSignIn({ toggleActiveContent });
    const { toggleCreateAccountView, toggleForgotPasswordView, view } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const rootClass = isActive ? classes.root : classes.root_hidden;

    let content;
    if (view === 'SIGNIN') {
        content = (
            <SignIn
                classes={{
                    modal_active: undefined,
                    root: classes.signInRoot,
                    buttonsContainer: classes.signinButtonsContainer
                }}
                showCreateAccount={toggleCreateAccountView}
                showForgotPassword={toggleForgotPasswordView}
                initialValues={initialValues}
            />
        );
    } else if (view === 'FORGOT_PASSWORD') {
        content = <ForgotPassword classes={{ root: classes.forgotPasswordRoot }} onCancel={toggleForgotPasswordView} />;
    } else if (view === 'CREATE_ACCOUNT') {
        content = (
            <CreateAccount
                classes={{ root: classes.createAccountRoot }}
                isCancelButtonHidden={false}
                onCancel={toggleCreateAccountView}
            />
        );
    }

    return (
        <div className={rootClass}>
            <button className={classes.closeSignin} onClick={handleShowSignin}>
                <FormattedMessage id="checkoutPage.guestSignIn.close" defaultMessage="Close" />{' '}
                <Icon size={24} src={X} />
            </button>
            <div className={classes.contentContainer}>{content}</div>
        </div>
    );
};

export default GuestSignIn;

GuestSignIn.propTypes = {
    classes: shape({
        root: string,
        root_hidden: string,
        header: string,
        contentContainer: string,
        signInRoot: string,
        forgotPasswordRoot: string,
        createAccountRoot: string
    }),
    isActive: bool.isRequired,
    toggleActiveContent: func.isRequired,
    initialValues: shape({
        email: string.isRequired
    })
};
