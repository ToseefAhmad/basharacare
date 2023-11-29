import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import Button from '@app/components/overrides/Button';
import TextInput from '@app/components/overrides/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './forgotPasswordForm.module.css';

const ForgotPasswordForm = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { initialValues, isResettingPassword, onSubmit } = props;
    const { formatMessage } = useIntl();
    return (
        <Form
            className={classes.root}
            initialValues={initialValues}
            onSubmit={onSubmit}
            data-cy="forgotPasswordForm-root"
        >
            <div className={classes.emailInputWrapper}>
                <TextInput
                    label={formatMessage({
                        id: 'forgotPasswordPage.emaillaceholder',
                        defaultMessage: 'E-mail'
                    })}
                    autoComplete="email"
                    field="email"
                    validate={isRequired}
                    data-cy="email"
                />
            </div>

            <div className={classes.buttonContainer}>
                <Button
                    className={classes.submitButton}
                    disabled={isResettingPassword}
                    type="submit"
                    priority="high"
                    data-cy="forgotPasswordForm-submitButton"
                >
                    <FormattedMessage
                        id="forgotPasswordForm.resetPasswordButtonText"
                        defaultMessage="Reset my Password"
                    />
                </Button>
                <Link className={classes.backButton} to="/sign-in">
                    <FormattedMessage id="createAccount.backText" defaultMessage="Go back" />
                </Link>
            </div>
        </Form>
    );
};

ForgotPasswordForm.propTypes = {
    classes: shape({
        form: string,
        buttonContainer: string
    }),
    initialValues: shape({
        email: string
    }),
    onCancel: func.isRequired,
    onSubmit: func.isRequired
};

ForgotPasswordForm.defaultProps = {
    initialValues: {}
};

export default ForgotPasswordForm;
