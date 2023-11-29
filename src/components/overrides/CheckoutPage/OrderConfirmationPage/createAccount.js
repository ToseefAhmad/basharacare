import { Form } from 'informed';
import { func, shape, string } from 'prop-types';
import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import Checkbox from '@app/components/overrides/Checkbox';
import { useCreateAccount } from '@app/components/overrides/CheckoutPage/OrderConfirmationPage/useCreateAccount.js';
import Field from '@app/components/overrides/Field';
import FormError from '@app/components/overrides/FormError';
import TextInput from '@app/components/overrides/TextInput';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Password from '@magento/venia-ui/lib/components/Password';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { hasLengthAtLeast, isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './createAccount.module.css';

const CreateAccount = props => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const onSubmit = useCallback(() => {
        // eslint-disable-next-line no-warning-comments
        // TODO: Redirect to account/order page when implemented.
        const { scrollTo } = globalThis;

        if (typeof scrollTo === 'function') {
            scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
        }
    }, []);

    const talonProps = useCreateAccount({
        initialValues: {
            email: props.email,
            firstName: props.firstname,
            lastName: props.lastname
        },
        onSubmit
    });

    const { errors, handleSubmit, isDisabled, initialValues } = talonProps;

    return (
        <div className={classes.root}>
            <h2>
                <FormattedMessage id="checkoutPage.quickCheckout" defaultMessage="Quick Checkout When You Return" />
            </h2>
            <p>
                <FormattedMessage
                    id="checkoutPage.setAPasswordAndSave"
                    defaultMessage="Set a password and save your information for next time in one easy step!"
                />
            </p>
            <FormError errors={Array.from(errors.values())} />
            <Form className={classes.form} initialValues={initialValues} onSubmit={handleSubmit}>
                <Field
                    label={formatMessage({
                        id: 'global.firstName',
                        defaultMessage: 'First Name'
                    })}
                >
                    <TextInput
                        field="customer.firstname"
                        autoComplete="given-name"
                        data-cy="OrderConfirmationPage-CreateAccount-firstName"
                        validate={isRequired}
                        validateOnBlur
                    />
                </Field>
                <Field
                    label={formatMessage({
                        id: 'global.lastName',
                        defaultMessage: 'Last Name'
                    })}
                >
                    <TextInput
                        field="customer.lastname"
                        autoComplete="family-name"
                        data-cy="OrderConfirmationPage-CreateAccount-lastName"
                        validate={isRequired}
                        validateOnBlur
                    />
                </Field>
                <Field
                    label={formatMessage({
                        id: 'global.email',
                        defaultMessage: 'Email'
                    })}
                >
                    <TextInput
                        field="customer.email"
                        autoComplete="email"
                        data-cy="OrderConfirmationPage-CreateAccount-email"
                        validate={isRequired}
                        validateOnBlur
                    />
                </Field>
                <Password
                    label={formatMessage({
                        id: 'global.password',
                        defaultMessage: 'Password'
                    })}
                    fieldName="password"
                    isToggleButtonHidden={false}
                    autoComplete="new-password"
                    data-cy="OrderConfirmationPage-CreateAccount-password"
                    validate={combine([isRequired, [hasLengthAtLeast, 8]])}
                    validateOnBlur
                />
                <div className={classes.subscribe}>
                    <Checkbox
                        field="subscribe"
                        id="subscribe"
                        defaultChecked={true}
                        data-cy="OrderConfirmationPage-CreateAccount-subscribe"
                        label={formatMessage({
                            id: 'checkoutPage.subscribe',
                            defaultMessage: 'Subscribe to Newsletters'
                        })}
                    />
                </div>
                <div className={classes.actions}>
                    <Button
                        disabled={isDisabled}
                        type="submit"
                        className={classes.create_account_button}
                        data-cy="OrderConfirmationPage-CreateAccount-createAccountButton"
                    >
                        <FormattedMessage id="checkoutPage.createAccount" defaultMessage="Create Account" />
                    </Button>
                </div>
            </Form>
        </div>
    );
};

export default CreateAccount;

CreateAccount.propTypes = {
    classes: shape({
        actions: string,
        create_account_button: string,
        form: string,
        root: string,
        subscribe: string
    }),
    initialValues: shape({
        email: string,
        firstName: string,
        lastName: string
    }),
    onSubmit: func
};
