import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import FormError from '@app/components/overrides/FormError/formError';
import LinkButton from '@app/components/overrides/LinkButton';
import Password from '@app/components/overrides/Password';
import TextInput from '@app/components/overrides/TextInput';
import { isEmail } from '@app/util/formValidator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { GET_CART_DETAILS_QUERY } from '@magento/venia-ui/lib/components/SignIn/signIn.gql';
import defaultClasses from '@magento/venia-ui/lib/components/SignIn/signIn.module.css';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import { useSignIn } from './useSignIn';

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

    const { errors, handleCreateAccount, handleForgotPassword, handleSubmit, isBusy, setFormApi } = talonProps;

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
        <div data-cy="SignIn-root" className={classes.root}>
            <span className={classes.title}>
                <FormattedMessage id="signIn.titleText" defaultMessage="Sign-in to Your Account" />
            </span>
            <FormError errors={Array.from(errors.values())} allowErrorMessages={true} />
            <Form
                getApi={setFormApi}
                className={classes.form}
                onSubmit={handleSubmit}
                data-cy="SignIn-form"
                initialValues={initialValues && initialValues}
            >
                <TextInput
                    data-cy="SignIn-email"
                    autoComplete="email"
                    isRequired={true}
                    field="email"
                    label={formatMessage({
                        id: 'signIn.emailAddressText',
                        defaultMessage: 'Email address'
                    })}
                    validate={combine([isRequired, isEmail])}
                />
                <Password
                    data-cy="SignIn-password"
                    fieldName="password"
                    label={formatMessage({
                        id: 'signIn.passwordText',
                        defaultMessage: 'Password'
                    })}
                    validate={isRequired}
                    autoComplete="current-password"
                    isToggleButtonHidden={false}
                />
                <div className={classes.forgotPasswordButtonContainer}>
                    <LinkButton
                        classes={forgotPasswordClasses}
                        type="button"
                        onClick={e => handleForgotPassword(e)}
                        data-cy="SignIn-forgotPasswordButton"
                    >
                        <FormattedMessage id="signIn.forgotPasswordText" defaultMessage="Forgot Password?" />
                    </LinkButton>
                </div>
                <div className={classes.buttonsContainer}>
                    <Button priority="high" type="submit" data-cy="SignInButton-root_highPriority">
                        <FormattedMessage id="signIn.signInText" defaultMessage="Sign In" />
                    </Button>
                    <Button
                        priority="normal"
                        type="button"
                        onClick={e => handleCreateAccount(e)}
                        data-cy="CreateAccount-initiateButton"
                    >
                        <FormattedMessage id="signIn.createAccountText" defaultMessage="Create an Account" />
                    </Button>
                </div>
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
