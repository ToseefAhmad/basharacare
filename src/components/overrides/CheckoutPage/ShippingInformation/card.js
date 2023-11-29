import { arrayOf, shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './card.module.css';

const Card = props => {
    const { classes: propClasses, shippingData } = props;
    const {
        city,
        country: { label: country },
        email,
        firstname,
        lastname,
        street,
        telephone
    } = shippingData;

    const streetRows = street.map((row, index) => {
        return <span key={index}>{row}</span>;
    });

    const classes = useStyle(defaultClasses, propClasses);

    const nameString = `${firstname} ${lastname}`;
    const additionalAddressString = `${city}, ${country}`;

    return (
        <div className={classes.root} data-cy="Card-root">
            <span>{email}</span>
            <span>{nameString}</span>
            <span>{telephone}</span>
            <div className={classes.address}>
                {streetRows}
                <span>{additionalAddressString}</span>
            </div>
        </div>
    );
};

export default Card;

Card.propTypes = {
    classes: shape({
        root: string,
        address: string,
        area: string
    }),
    shippingData: shape({
        city: string.isRequired,
        country: shape({
            label: string.isRequired
        }).isRequired,
        email: string.isRequired,
        firstname: string.isRequired,
        lastname: string.isRequired,
        street: arrayOf(string).isRequired,
        telephone: string.isRequired
    }).isRequired
};
