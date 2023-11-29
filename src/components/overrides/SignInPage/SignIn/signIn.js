import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import LinkButton from '@app/components/overrides/LinkButton';
import { useSignIn } from '@app/components/overrides/SignIn/useSignIn';
import TextInput from '@app/components/overrides/TextInput';
import { isEmail } from '@app/util/formValidator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Password from '@magento/venia-ui/lib/components/Password';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import { GET_CART_DETAILS_QUERY } from './signIn.gql';
import defaultClasses from './signIn.module.css';

const SignIn = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { setDefaultUsername, showCreateAccount, showForgotPassword, initialValues } = props;
    const { formatMessage } = useIntl();
    const talonProps = useSignIn({
        getCartDetailsQuery: GET_CART_DETAILS_QUERY,
        setDefaultUsername,
        showCreateAccount,
        showForgotPassword
    });

    const { handleForgotPassword, handleSubmit, isBusy, setFormApi } = talonProps;

    if (isBusy) {
        return (
            <div className={classes.modal_active}>
                <LoadingIndicator>
                    <FormattedMessage id="signIn.loadingText" defaultMessage="Signing In" />
                </LoadingIndicator>
            </div>
        );
    }

    const forgotPasswordClasses = {
        root: classes.forgotPasswordButton
    };

    return (
        <div className={classes.root}>
            <h3 className={classes.title}>
                <FormattedMessage id="signIn.Title" defaultMessage="Registered Customers" />
            </h3>
            <p className={classes.descriptionText}>
                <FormattedMessage id="signIn.subText" defaultMessage="Please log in to your account" />
            </p>
            <Form
                getApi={setFormApi}
                className={classes.form}
                onSubmit={handleSubmit}
                data-cy="SignIn-form"
                initialValues={initialValues && initialValues}
            >
                <div className={classes.emailWrapper}>
                    <TextInput
                        data-cy="SignIn-email"
                        label={formatMessage({
                            id: 'global.email',
                            defaultMessage: 'Email'
                        })}
                        autoComplete="email"
                        field="email"
                        isRequired={true}
                        validate={combine([isEmail, isRequired])}
                    />
                </div>

                <Password
                    data-cy="SignIn-password"
                    fieldName="password"
                    validate={isRequired}
                    label={formatMessage({
                        id: 'global.password',
                        defaultMessage: 'Password'
                    })}
                    autoComplete="current-password"
                    isToggleButtonHidden={false}
                />
                <div className={classes.signInButtonContainer}>
                    <Button priority="high" type="submit" data-cy="SignInButton-root_highPriority">
                        <FormattedMessage id="signIn.logInText" defaultMessage="Log In" />
                    </Button>
                </div>
                <div className={classes.forgotPasswordButtonContainer}>
                    <LinkButton
                        classes={forgotPasswordClasses}
                        type="button"
                        onClick={handleForgotPassword}
                        data-cy="SignIn-forgotPasswordButton"
                    >
                        <FormattedMessage id="signIn.forgotYourPasswordText" defaultMessage="Forgot your password?" />
                    </LinkButton>
                </div>
                <p className={classes.requiredFieldsText}>
                    <FormattedMessage id="signIn.requiredFieldsText" defaultMessage="* Required Fields" />
                </p>
            </Form>
        </div>
    );
};

export default SignIn;
SignIn.propTypes = {
    classes: shape({
        buttonsContainer: string,
        form: string,
        forgotPasswordButton: string,
        forgotPasswordButtonContainer: string,
        root: string,
        title: string
    }),
    setDefaultUsername: func,
    showCreateAccount: func,
    showForgotPassword: func,
    initialValues: shape({
        email: string.isRequired
    })
};
SignIn.defaultProps = {
    setDefaultUsername: () => {},
    showCreateAccount: () => {},
    showForgotPassword: () => {}
};
