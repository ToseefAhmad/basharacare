import React from 'react';
import { FormattedMessage } from 'react-intl';

import LinkButton from '@app/components/overrides/LinkButton';

import classes from './billingAddress.module.css';
export const BillingAddress = props => {
    const { address, handleEditAddress, countryDisplayNameMap } = props;
    const { city, country_code, firstname, middlename, lastname, street, default_billing, telephone } = address || {};

    const editAddress = () => handleEditAddress(address);
    const nameString = [firstname, middlename, lastname].filter(name => !!name).join(' ');
    const countryName = countryDisplayNameMap.get(country_code);

    const maybeChangeAddressButton = address ? (
        <LinkButton classes={{ root: classes.editButton }} onClick={editAddress} data-cy="addressCard-editButton">
            <span className={classes.actionLabel}>
                <FormattedMessage
                    id="accountDashboardPage.defaultBillingEdit"
                    defaultMessage="Change Billing Address"
                />
            </span>
        </LinkButton>
    ) : null;

    const defaultBillingAddressContent = default_billing ? (
        <div className={classes.content}>
            <p>{nameString}</p>
            <p>{street[0]}</p>
            <p>{city}</p>
            <p>{countryName}</p>
            <p>
                <FormattedMessage id="addressBook.telephone" defaultMessage="T: {telephone}" values={{ telephone }} />
            </p>
        </div>
    ) : (
        <div>
            <FormattedMessage
                id="accountDashboardPage.noDefaultBillingAddress"
                defaultMessage="Default Billing Address is not set."
            />
        </div>
    );

    return (
        <div className={classes.root}>
            <span className={classes.title}>
                <span>
                    <FormattedMessage id="accountDashboardPage.default" defaultMessage="Default" />
                </span>
                <span>
                    {' '}
                    <FormattedMessage
                        id="accountDashboardPage.defaultBillingTextSecondary"
                        defaultMessage=" Billing Address"
                    />
                </span>
            </span>
            {defaultBillingAddressContent}
            {maybeChangeAddressButton}
        </div>
    );
};
