import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { BillingAddress } from '@app/components/AccountDashboard/AccountInformation/billingAddress.js';
import { ShippingAddress } from '@app/components/AccountDashboard/AccountInformation/shippingAddress';

import classes from './addressBook.module.css';

export const AddressBook = props => {
    const { customerAddresses, countryDisplayNameMap } = props;

    const defaultShippingAddress = useMemo(() => {
        return customerAddresses.find(address => address.default_shipping);
    }, [customerAddresses]);

    const defaultBillingAddress = useMemo(() => {
        return customerAddresses.find(address => address.default_billing);
    }, [customerAddresses]);

    return (
        <div className={classes.root}>
            <div className={classes.title}>
                <h4>
                    <FormattedMessage id="accountDashboardPage.accountAddressBookTitle" defaultMessage="Address" />
                </h4>
                <h4>
                    <FormattedMessage id="accountDashboardPage.accountAddressBookSecondary" defaultMessage="Book" />
                </h4>
            </div>
            <div className={classes.content}>
                <BillingAddress address={defaultBillingAddress} countryDisplayNameMap={countryDisplayNameMap} />
                <ShippingAddress address={defaultShippingAddress} countryDisplayNameMap={countryDisplayNameMap} />
            </div>
        </div>
    );
};
