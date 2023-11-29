import { func, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import FormErrors from '@app/components/overrides/FormError';
import { useStyle } from '@magento/venia-ui/lib/classify';

import forgotPasswordOperations from './forgotPassword.gql';
import defaultClasses from './forgotPassword.module.css';
import ForgotPasswordForm from './ForgotPasswordForm';
import { useForgotPassword } from './useForgotPassword';

const ForgotPassword = props => {
    const { initialValues, onCancel } = props;

    const { formatMessage } = useIntl();
    const talonProps = useForgotPassword({
        onCancel,
        ...forgotPasswordOperations
    });

    const { formErrors, handleCancel, handleFormSubmit, isResettingPassword } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);
    const INSTRUCTIONS = formatMessage({
        id: 'forgotPassword.instructionsText',
        defaultMessage: 'Please enter your email address below to receive a password reset link.'
    });

    return (
        <div className={classes.root}>
            <p className={classes.instructions}>{INSTRUCTIONS}</p>
            <ForgotPasswordForm
                initialValues={initialValues}
                isResettingPassword={isResettingPassword}
                onSubmit={handleFormSubmit}
                onCancel={handleCancel}
            />
            <FormErrors errors={formErrors} allowErrorMessages={true} />
            <p className={classes.requiredFieldsText}>
                <FormattedMessage id="createAccount.requiredFieldsText" defaultMessage="* Required Fields" />
            </p>
        </div>
    );
};

export default ForgotPassword;

ForgotPassword.propTypes = {
    classes: shape({
        instructions: string,
        root: string
    }),
    initialValues: shape({
        email: string
    }),
    onCancel: func
};

ForgotPassword.defaultProps = {
    onCancel: () => {}
};
