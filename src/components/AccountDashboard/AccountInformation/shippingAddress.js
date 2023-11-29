import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useDashboard } from '@app/components/AccountDashboard/useDashboard';

import classes from './shippingAddress.module.css';
export const ShippingAddress = ({ address }) => {
    const { city, country_code, default_shipping, firstname, lastname, street, telephone } = address || {};

    const { countryDisplayNameMap } = useDashboard();

    const countryName = countryDisplayNameMap.get(country_code);

    const defaultShippingAddressContent = default_shipping ? (
        <div className={classes.content}>
            <p>{firstname + ' ' + lastname}</p>
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
        <div>
            <FormattedMessage
                id="accountDashboardPage.nodefaultAdress"
                defaultMessage="Default Shipping Address is not set"
            />
        </div>
    );

    return (
        <div className={classes.root}>
            <span className={classes.title}>
                <FormattedMessage
                    id="accountDashboardPage.defaultShippingTextSecondaryLabel"
                    defaultMessage="Default Shipping Address"
                />
            </span>
            {defaultShippingAddressContent}
            <Link className={classes.action} to="/address-book">
                <FormattedMessage id="accountDashboardPage.defaultShippingEditText" defaultMessage="Edit Address" />
            </Link>
        </div>
    );
};
