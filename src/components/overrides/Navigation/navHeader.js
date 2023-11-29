import { bool, func, shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { useIntl } from 'react-intl';

import AccountChip from '../AccountChip';

import { ArrowShort, Close } from '@app/components/Icons';
import { useNavigationHeader } from '@magento/peregrine/lib/talons/Navigation/useNavigationHeader';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Trigger from '@magento/venia-ui/lib/components/Trigger';

import defaultClasses from './navHeader.module.css';

const NavHeader = ({ isTopLevel, onBack, view, handleClose, ...props }) => {
    const { formatMessage } = useIntl();

    const talonProps = useNavigationHeader({
        isTopLevel,
        onBack,
        view
    });

    const { handleBack, isTopLevelMenu } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const titles = {
        CREATE_ACCOUNT: formatMessage({
            id: 'navHeader.createAccountText',
            defaultMessage: 'Create Account'
        }),
        FORGOT_PASSWORD: formatMessage({
            id: 'navHeader.forgotPasswordText',
            defaultMessage: 'Forgot Password'
        }),
        MY_ACCOUNT: formatMessage({
            id: 'navHeader.myAccountText',
            defaultMessage: 'My Account'
        }),
        SIGN_IN: formatMessage({
            id: 'navHeader.signInText',
            defaultMessage: 'Sign In'
        }),
        MENU: formatMessage({
            id: 'navHeader.mainMenuText',
            defaultMessage: 'Menu'
        })
    };

    let titleElement;
    if (['MY_ACCOUNT', 'SIGN_IN'].includes(view)) {
        titleElement = (
            <AccountChip
                fallbackText={formatMessage({
                    id: 'navHeader.accountText',
                    defaultMessage: 'Account'
                })}
            />
        );
    } else {
        const title = titles[view] || titles.MENU;
        titleElement = <span>{title}</span>;
    }

    return (
        <Fragment>
            {isTopLevelMenu ? (
                <span key="title" className={classes.title}>
                    {titleElement}
                </span>
            ) : (
                <Trigger action={handleBack}>
                    <ArrowShort />
                </Trigger>
            )}
            <Trigger action={handleClose}>
                <Close />
            </Trigger>
        </Fragment>
    );
};

export default NavHeader;

NavHeader.propTypes = {
    classes: shape({
        title: string
    }),
    isTopLevel: bool,
    onBack: func.isRequired,
    view: string.isRequired
};
