import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import { BillingAddress } from '@app/components/overrides/AddressBookPage/Addresses/billingAddress';
import { ShippingAddress } from '@app/components/overrides/AddressBookPage/Addresses/shippingAddress';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import LinkButton from '@magento/venia-ui/lib/components/LinkButton';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import AddEditDialog from './addEditDialog';
import defaultClasses from './addressBookPage.module.css';
import AddressCard from './addressCard';
import { useAddressBookPage } from './useAddressBookPage';

const AddressBookPage = props => {
    const talonProps = useAddressBookPage();
    const {
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        formErrors,
        formProps,
        handleAddAddress,
        handleCancelDeleteAddress,
        handleCancelDialog,
        handleConfirmDeleteAddress,
        handleConfirmDialog,
        handleEditAddress,
        isDeletingCustomerAddress,
        isDialogBusy,
        isDialogEditMode,
        isDialogOpen,
        isLoading,
        deleteAddress
    } = talonProps;

    const defaultShippingAddress = useMemo(() => {
        return customerAddresses.find(address => address.default_shipping);
    }, [customerAddresses]);

    const isAddressesExist = !!customerAddresses.length;

    const defaultBillingAddress = useMemo(() => {
        return customerAddresses.find(address => address.default_billing);
    }, [customerAddresses]);

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const PAGE_TITLE = formatMessage({
        id: 'addressBookPage.addressBookText',
        defaultMessage: 'Address Book'
    });

    const addressBookElements = useMemo(() => {
        const defaultToBeginning = (address1, address2) => {
            if (address1.default_shipping) return -1;
            if (address2.default_shipping) return 1;
            return 0;
        };

        return Array.from(customerAddresses)
            .sort(defaultToBeginning)
            .map(addressEntry => {
                const countryName = countryDisplayNameMap.get(addressEntry.country_code);

                const boundEdit = () => handleEditAddress(addressEntry);
                const boundDelete = () => deleteAddress(addressEntry.id);
                const isConfirmingDelete = confirmDeleteAddressId === addressEntry.id;

                return (
                    <>
                        <AddressCard
                            address={addressEntry}
                            countryName={countryName}
                            isConfirmingDelete={isConfirmingDelete}
                            isDeletingCustomerAddress={isDeletingCustomerAddress}
                            key={addressEntry.id}
                            onCancelDelete={handleCancelDeleteAddress}
                            onConfirmDelete={handleConfirmDeleteAddress}
                            onDelete={boundDelete}
                            onEdit={boundEdit}
                        />
                    </>
                );
            });
    }, [
        confirmDeleteAddressId,
        countryDisplayNameMap,
        customerAddresses,
        deleteAddress,
        handleCancelDeleteAddress,
        handleConfirmDeleteAddress,
        handleEditAddress,
        isDeletingCustomerAddress
    ]);

    const emptyAddressesLabel = !isAddressesExist ? (
        <div className={classes.noAdditional}>
            <FormattedMessage
                id="addressBook.noAdditionalAddresses"
                defaultMessage="You have no other address entries in your address book."
            />
        </div>
    ) : null;

    if (isLoading) {
        return fullPageLoadingIndicator;
    }

    return (
        <AccountPageWrapper>
            <div className={classes.root}>
                <div className={classes.title} data-cy="AccountInformationPage-title">
                    <h2>
                        <FormattedMessage id="accountDashboardPage.default" defaultMessage="Default" />
                    </h2>
                    <h2>
                        <FormattedMessage id="accountInformationPage.addressBookSecondary" defaultMessage="Addresses" />
                    </h2>
                </div>
                <StoreTitle>{PAGE_TITLE}</StoreTitle>
                <div className={classes.content} data-cy="AddressBookPage-content">
                    <BillingAddress
                        address={defaultBillingAddress}
                        handleEditAddress={handleEditAddress}
                        countryDisplayNameMap={countryDisplayNameMap}
                    />
                    <ShippingAddress
                        address={defaultShippingAddress}
                        handleEditAddress={handleEditAddress}
                        countryDisplayNameMap={countryDisplayNameMap}
                    />
                    <div className={classes.additionalTitle}>
                        <span>
                            <FormattedMessage
                                id="accountInformationPage.additionalAddressBookTitle"
                                defaultMessage="Additional"
                            />
                        </span>
                        <span>
                            <FormattedMessage
                                id="accountInformationPage.additionalAddressBookSecondary"
                                defaultMessage="Address Entries"
                            />
                        </span>
                    </div>
                    {emptyAddressesLabel}
                    {addressBookElements}
                </div>
                <LinkButton
                    className={classes.addButton}
                    key="addAddressButton"
                    onClick={handleAddAddress}
                    data-cy="AddressBookPage-addButton"
                >
                    <span className={classes.addText}>
                        <FormattedMessage id="addressBookPage.addAddressButtonText" defaultMessage="Add new Address" />
                    </span>
                </LinkButton>
                <AddEditDialog
                    formErrors={formErrors}
                    formProps={formProps}
                    isBusy={isDialogBusy}
                    isEditMode={isDialogEditMode}
                    isOpen={isDialogOpen}
                    onCancel={handleCancelDialog}
                    onConfirm={handleConfirmDialog}
                    isAddressesExist={isAddressesExist}
                />
            </div>
        </AccountPageWrapper>
    );
};

export default AddressBookPage;
