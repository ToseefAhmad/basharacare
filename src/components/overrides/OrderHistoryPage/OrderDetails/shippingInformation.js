import { arrayOf, shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './shippingInformation.module.css';

const ShippingInformation = props => {
    const { data, classes: propsClasses } = props;
    const classes = useStyle(defaultClasses, propsClasses);

    let shippingContentElement;

    if (data) {
        const { city, country_code, firstname, lastname, street } = data;

        const additionalAddressString = `${city},  ${country_code}`;
        const fullName = `${firstname} ${lastname}`;
        const streetRows = street.map((row, index) => {
            return (
                <span className={classes.streetRow} key={index}>
                    {row}
                </span>
            );
        });

        shippingContentElement = (
            <Fragment>
                <span className={classes.name}>{fullName}</span>
                {streetRows}
                <div className={classes.additionalAddress}>{additionalAddressString}</div>
            </Fragment>
        );
    } else {
        shippingContentElement = (
            <FormattedMessage id="orderDetails.noShippingInformation" defaultMessage="No shipping information" />
        );
    }

    return (
        <div className={classes.root} data-cy="OrderDetails-ShippingInformation-root">
            <div className={classes.heading}>
                <FormattedMessage id="orderDetails.shippingAddressLabel" defaultMessage="Shipping Address" />
            </div>
            {shippingContentElement}
        </div>
    );
};

export default ShippingInformation;

ShippingInformation.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        name: string,
        streetRow: string,
        additionalAddress: string
    }),
    data: shape({
        city: string,
        country_code: string,
        firstname: string,
        lastname: string,
        postcode: string,
        region: string,
        street: arrayOf(string),
        telephone: string
    })
};
