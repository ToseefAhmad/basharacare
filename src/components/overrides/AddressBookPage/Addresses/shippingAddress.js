import React from 'react';
import { FormattedMessage } from 'react-intl';

import LinkButton from '@app/components/overrides/LinkButton';

import classes from './shippingAddress.module.css';
export const ShippingAddress = props => {
    const { address, handleEditAddress, countryDisplayNameMap } = props;
    const { city, country_code, firstname, middlename, lastname, street, default_shipping, telephone } = address || {};

    const editAddress = () => handleEditAddress(address);
    const countryName = countryDisplayNameMap.get(country_code);
    const nameString = [firstname, middlename, lastname].filter(name => !!name).join(' ');

    const maybeChangeAddressButton = address ? (
        <LinkButton classes={{ root: classes.editButton }} onClick={editAddress} data-cy="addressCard-editButton">
            <span className={classes.actionLabel}>
                <FormattedMessage
                    id="accountDashboardPage.defaultShippingEdit"
                    defaultMessage="Change Shipping Address"
                />
            </span>
        </LinkButton>
    ) : null;

    const defaultShippingAddressContent = default_shipping ? (
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
                id="accountDashboardPage.nodefaultAdress"
                defaultMessage="Default Shipping Address is not set"
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
                        id="accountDashboardPage.defaultShippingTextSecondary"
                        defaultMessage=" Shipping Address"
                    />
                </span>
            </span>
            {defaultShippingAddressContent}
            {maybeChangeAddressButton}
        </div>
    );
};
