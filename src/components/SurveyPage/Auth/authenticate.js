import { bool, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Checkbox from '@app/components/overrides/Checkbox';
import Field from '@app/components/overrides/Field';
import TextInput from '@app/components/overrides/TextInput';
import { isEmail } from '@app/util/formValidator';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Password from '@magento/venia-ui/lib/components/Password';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { hasLengthAtLeast, isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './authenticate.module.css';

const Authenticate = ({ authState, isAuthBusy }) => {
    const { formatMessage } = useIntl();

    if (isAuthBusy) {
        return (
            <div className={classes.root}>
                <LoadingIndicator>
                    <FormattedMessage id="authenticate.loadingText" defaultMessage="Authenticating" />
                </LoadingIndicator>
            </div>
        );
    }

    return (
        <div className={classes.root}>
            {authState === 'CREATE_ACCOUNT' && (
                <>
                    <Field>
                        <TextInput
                            field="customer.firstname"
                            validate={isRequired}
                            label={formatMessage({
                                id: 'global.firstName',
                                defaultMessage: 'First Name'
                            })}
                        />
                    </Field>
                    <Field>
                        <TextInput
                            field="customer.lastname"
                            validate={isRequired}
                            label={formatMessage({
                                id: 'global.lastName',
                                defaultMessage: 'Last Name'
                            })}
                        />
                    </Field>
                </>
            )}
            <Field>
                <TextInput
                    field="customer.email"
                    isRequired={true}
                    validate={combine([isEmail, isRequired])}
                    validateOnBlur
                    label={formatMessage({
                        id: 'createAccount.emailText',
                        defaultMessage: 'Email'
                    })}
                />
            </Field>
            <Password
                autoComplete="new-password"
                fieldName="customer.password"
                isRequired={true}
                isToggleButtonHidden={false}
                label={formatMessage({
                    id: 'createAccount.passwordText',
                    defaultMessage: 'Password'
                })}
                validate={combine([isRequired, [hasLengthAtLeast, 8]])}
                validateOnBlur
                maskOnBlur={true}
            />
            {authState === 'CREATE_ACCOUNT' && (
                <Checkbox
                    classes={{ root: classes.checkbox }}
                    field="customer.subscribe"
                    id="subscribe"
                    label={formatMessage({
                        id: 'createAccount.subscribeText',
                        defaultMessage: 'Subscribe to news and updates'
                    })}
                />
            )}
            <Checkbox
                classes={{ root: classes.checkbox }}
                field="agree"
                id="agree"
                label={formatMessage({
                    id: 'authenticate.policyAgreementText',
                    defaultMessage:
                        'I would like to have adapted direct marketing to learn more about skincare and take advantage of offers. Read more in our privacy policy.'
                })}
            />
            <Checkbox
                classes={{ root: classes.checkbox }}
                field="consent"
                id="consent"
                validateOnBlur
                validate={isRequired}
                label={formatMessage({
                    id: 'authenticate.consentText',
                    defaultMessage:
                        'I hereby give my consent and thus allow Basharacare to save my personal information.'
                })}
            />
        </div>
    );
};

Authenticate.propTypes = {
    authState: string,
    isAuthBusy: bool
};

export default Authenticate;
