import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useDashboard } from '@app/components/AccountDashboard/useDashboard';

import classes from './billingAddress.module.css';
export const BillingAddress = ({ address }) => {
    const { city, country_code, firstname, middlename, lastname, street = [], default_billing, telephone } =
        address || {};

    const { countryDisplayNameMap } = useDashboard();

    const countryName = countryDisplayNameMap.get(country_code);
    const nameString = [firstname, middlename, lastname].filter(name => !!name).join(' ');
    const defaultBillingAddressContent = default_billing ? (
        <div className={classes.content}>
            <p>{nameString}</p>
            <p>{street[0]}</p>
            <p>{city}</p>
            <p>{countryName}</p>
            <p>
                <FormattedMessage
                    id="AccountDashboard.telephone"
                    defaultMessage="T: {telephone}"
                    values={{ telephone }}
                />
            </p>
        </div>
    ) : (
        <div className={classes.content}>
            <FormattedMessage
                id="accountDashboardPage.noDefaultBillingAdress"
                defaultMessage="Default Billing Address is not set"
            />
        </div>
    );
    return (
        <div className={classes.root}>
            <span className={classes.title}>
                <FormattedMessage
                    id="accountDashboardPage.defaultBillingTextSecondaryLabel"
                    defaultMessage="Default Billing Address"
                />
            </span>
            {defaultBillingAddressContent}
            <Link className={classes.action} to="/address-book">
                <FormattedMessage id="accountDashboardPage.defaultBillingEditText" defaultMessage="Edit Address" />
            </Link>
        </div>
    );
};
