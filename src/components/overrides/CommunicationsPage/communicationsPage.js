import { Form } from 'informed';
import React, { useCallback } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import Button from '@app/components/overrides/Button';
import Checkbox from '@app/components/overrides/Checkbox';
import Field from '@app/components/overrides/Field';
import FormError from '@app/components/overrides/FormError';
import { useToasts } from '@magento/peregrine';
import { useCommunicationsPage } from '@magento/peregrine/lib/talons/CommunicationsPage/useCommunicationsPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Message } from '@magento/venia-ui/lib/components/Field';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './communicationsPage.module.css';

const CommunicationsPage = props => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const [, { addToast }] = useToasts();

    const afterSubmit = useCallback(() => {
        addToast({
            type: 'info',
            message: formatMessage({
                id: 'communicationsPage.preferencesText',
                defaultMessage: 'Your preferences have been updated.'
            }),
            timeout: 5000
        });
    }, [addToast, formatMessage]);

    const talonProps = useCommunicationsPage({ afterSubmit });

    const { formErrors, handleSubmit, initialValues, isDisabled, loadDataError } = talonProps;

    const errorMessage = loadDataError ? (
        <Message>
            <FormattedMessage
                id="communicationsPage.errorTryAgain"
                defaultMessage="Something went wrong. Please refresh and try again."
            />
        </Message>
    ) : null;

    if (!initialValues) {
        return fullPageLoadingIndicator;
    }
    const title = formatMessage({
        id: 'communicationsPage.title',
        defaultMessage: 'Communications'
    });

    const pageContent = (
        <div className={classes.root}>
            <StoreTitle>{title}</StoreTitle>
            <FormError errors={formErrors} />
            <Form className={classes.form} onSubmit={handleSubmit} initialValues={initialValues}>
                <Field id="isSubscribed">
                    <Checkbox
                        field="isSubscribed"
                        label={formatMessage({
                            id: 'communicationsPage.subscribeTextGeneral',
                            defaultMessage: 'General Subscription'
                        })}
                    />
                </Field>
                <div className={classes.buttonsContainer}>
                    <Button disabled={isDisabled} type="submit" priority="high">
                        {isDisabled
                            ? formatMessage({
                                  id: 'communicationsPage.savingText',
                                  defaultMessage: 'Saving'
                              })
                            : formatMessage({
                                  id: 'communicationsPage.changesTextSave',
                                  defaultMessage: 'Save'
                              })}
                    </Button>
                    <Link className={classes.link} to="/account-dashboard">
                        <FormattedMessage id="global.account" defaultMessage="Go back" />
                    </Link>
                </div>
            </Form>
        </div>
    );

    return (
        <AccountPageWrapper pageTitle="Subscription option">
            <div className={classes.title} data-cy="communicationsPage-title">
                <span className={classes.firstTitle}>
                    <FormattedMessage
                        id="communicationsPage.communicationsPageTitleBold"
                        defaultMessage="Subscription"
                    />
                </span>
                &nbsp;
                <span className={classes.secondTitle}>
                    <FormattedMessage
                        id="communicationsPage.communicationsPageSecondaryNormal"
                        defaultMessage="option"
                    />
                </span>
            </div>
            <div className={classes.root}>{errorMessage ? errorMessage : pageContent}</div>
        </AccountPageWrapper>
    );
};

export default CommunicationsPage;
