import React from 'react';
import { FormattedMessage } from 'react-intl';

import Link from '@magento/venia-ui/lib/components/Link';

import classes from './register.module.css';

const Register = () => {
    return (
        <div className={classes.root}>
            <h3 className={classes.title}>
                <FormattedMessage id="register.Title" defaultMessage="New Customers" />
            </h3>
            <p className={classes.descriptionText}>
                <FormattedMessage
                    id="register.subText"
                    defaultMessage="Creating an account has many benefits: check out faster, keep more than one address, track orders and more."
                />
            </p>

            <Link to="/create-account" className={classes.registerButton}>
                <FormattedMessage id="register.ButtonText" defaultMessage="Create An Account" />
            </Link>
        </div>
    );
};

export default Register;
