import { shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { useCreateAccountPage } from '@magento/peregrine/lib/talons/CreateAccountPage/useCreateAccountPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

import CreateAccount from './CreateAccount';
import defaultClasses from './createAccountPage.module.css';

const CreateAccountPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { createAccountProps } = useCreateAccountPage(props);
    const { formatMessage } = useIntl();

    return (
        <div className={classes.root}>
            <StoreTitle>
                {formatMessage({
                    id: 'createAccountPage.titles',
                    defaultMessage: 'Create an Account'
                })}
            </StoreTitle>
            <div className={classes.title} data-cy="AccountInformationPage-title">
                <h1>
                    <span className={classes.firstWord}>
                        <FormattedMessage id="createAccountPage.Title" defaultMessage="Customer" />
                    </span>
                    <FormattedMessage id="createAccountPage.titleSecondary" defaultMessage="Account Create" />
                </h1>
            </div>
            <div className={classes.contentContainer}>
                <CreateAccount {...createAccountProps} />
            </div>
        </div>
    );
};

CreateAccountPage.defaultProps = {
    signedInRedirectUrl: '/account-dashboard',
    signInPageUrl: '/sign-in'
};

CreateAccountPage.propTypes = {
    classes: shape({
        root: string,
        header: string,
        contentContainer: string
    }),
    signedInRedirectUrl: string,
    signInPageUrl: string
};

export default CreateAccountPage;
