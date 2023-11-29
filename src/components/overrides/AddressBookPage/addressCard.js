import { arrayOf, bool, func, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import LinkButton from '../LinkButton';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './addressCard.module.css';

const AddressCard = props => {
    const { address, classes: propClasses, countryName, onConfirmDelete, onEdit, onDelete } = props;

    const {
        city,
        country_code,
        firstname,
        middlename = '',
        lastname,
        street,
        telephone,
        default_billing,
        default_shipping
    } = address || {};

    const classes = useStyle(defaultClasses, propClasses);

    const deleteAddress = () => {
        onDelete();
        onConfirmDelete();
    };

    const streetRows = street.map((row, index) => {
        return (
            <span className={classes.streetRow} key={index}>
                {row}
            </span>
        );
    });

    const nameString = [firstname, middlename, lastname].filter(name => !!name).join(' ');
    const additionalAddressString = `${city}`;

    const deleteButtonElement = !default_shipping ? (
        <LinkButton classes={{ root: classes.deleteButton }} onClick={deleteAddress} data-cy="addressCard-deleteButton">
            <span className={classes.actionLabel}>
                <FormattedMessage id="addressBookPage.deleteAddress" defaultMessage="Delete Address" />
            </span>
        </LinkButton>
    ) : null;

    if (default_billing || default_shipping) {
        return null;
    }

    return (
        <div className={classes.root} data-cy="addressCard-root">
            <div className={classes.contentContainer} data-cy="addressCard-contentContainer">
                <span className={classes.name}>{nameString}</span>
                {streetRows}
                <span className={classes.additionalAddress}>{additionalAddressString}</span>
                <span className={classes.country}>{countryName || country_code}</span>
                <span className={classes.telephone}>
                    <FormattedMessage
                        id="addressBookPage.telephone"
                        defaultMessage="Phone {telephone}"
                        values={{ telephone }}
                    />
                </span>
            </div>
            <div className={classes.actionContainer}>
                <LinkButton classes={{ root: classes.editButton }} onClick={onEdit} data-cy="addressCard-editButton">
                    <span className={classes.actionLabel}>
                        <FormattedMessage id="addressBookPage.editAddress" defaultMessage="Edit Address" />
                    </span>
                </LinkButton>
                {deleteButtonElement}
            </div>
        </div>
    );
};

export default AddressCard;

AddressCard.propTypes = {
    address: shape({
        city: string,
        country_code: string,
        default_shipping: bool,
        firstname: string,
        lastname: string,
        region: shape({
            region_code: string,
            region: string
        }),
        street: arrayOf(string),
        telephone: string
    }).isRequired,
    classes: shape({
        actionContainer: string,
        actionLabel: string,
        additionalAddress: string,
        contentContainer: string,
        country: string,
        defaultBadge: string,
        defaultCard: string,
        deleteButton: string,
        editButton: string,
        flash: string,
        linkButton: string,
        name: string,
        root: string,
        root_updated: string,
        streetRow: string,
        telephone: string
    }),
    countryName: string,
    isConfirmingDelete: bool,
    isDeletingCustomerAddress: bool,
    onCancelDelete: func,
    onConfirmDelete: func,
    onDelete: func,
    onEdit: func
};
