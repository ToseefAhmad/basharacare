import { Form } from 'informed';
import { shape, string } from 'prop-types';
import React, { Fragment, useEffect, useLayoutEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../overrides/Button';

import { useContactPage } from '@app/components/overrides/ContactPage/useContactPage';
import StyledHeading from '@app/components/StyledHeading';
import { useAppContext } from '@app/context/App';
import { isEmail } from '@app/util/formValidator';
import { useToasts } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import Field from '@magento/venia-ui/lib/components/Field';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { Meta, StoreTitle } from '@magento/venia-ui/lib/components/Head';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './exchangeAndReturn.module.css';

// The banner itself is very similar to the one, which is already created for ContactUS page.
// So this cms_block ('contact-page-banner') is just re-used, so it would be easier to change the similar text for both pages at once.
const BANNER_IDENTIFIER = 'contact-page-banner';
const TITLE_IDENTIFIER = 'exchange-page-title';
const SIDEBAR_IDENTIFIER = 'exchange-page-sidebar';
const NOT_FOUND_MESSAGE = "Looks like the page you were hoping to find doesn't exist. Sorry about that.";

const ExchangePage = ({ classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);
    const { formatMessage } = useIntl();
    const [, { setIsPageFullWidth }] = useAppContext();
    const talonProps = useContactPage({
        cmsBlockIdentifiers: [BANNER_IDENTIFIER, TITLE_IDENTIFIER, SIDEBAR_IDENTIFIER]
    });
    const [, { addToast }] = useToasts();

    const { isEnabled, errors, handleSubmit, isBusy, isLoading, setFormApi, response } = talonProps;

    useEffect(() => {
        if (response && response.status) {
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'exchangePage.submitMessage',
                    defaultMessage: 'Your message has been sent.'
                })
            });
        }
    }, [addToast, formatMessage, response]);

    useLayoutEffect(() => {
        setIsPageFullWidth(true);
        return () => setIsPageFullWidth(false);
    }, [setIsPageFullWidth]);

    useEffect(() => {
        document.body.classList.add('exchange-page');
        return () => globalThis.document.body.classList.remove('exchange-page');
    }, []);

    if (!isLoading && !isEnabled) {
        return (
            <Fragment>
                <StoreTitle>
                    {formatMessage({
                        id: 'exchangePage.title',
                        defaultMessage: 'Exchange Us'
                    })}
                </StoreTitle>
                <ErrorView
                    message={formatMessage({
                        // Intl-messages-tool is-exported
                        id: 'magentoRoute.routeError',
                        defaultMessage: NOT_FOUND_MESSAGE
                    })}
                />
            </Fragment>
        );
    }

    if (isLoading) {
        return (
            <div className={classes.loadingContainer}>
                <LoadingIndicator>
                    <FormattedMessage id="exchangePage.loading" defaultMessage="Loading Exchange Page" />
                </LoadingIndicator>
            </div>
        );
    }

    const maybeLoadingIndicator = isBusy ? (
        <div className={classes.submitLoadingContainer}>
            <LoadingIndicator>
                <FormattedMessage id="exchangePage.loadingText" defaultMessage="Sending" />
            </LoadingIndicator>
        </div>
    ) : null;

    const pageTitle = formatMessage({
        id: 'exchangePage.title',
        defaultMessage: 'Exchange and Refund'
    });

    const metaDescription = formatMessage({
        id: 'exchangePage.metaDescription',
        defaultMessage: 'Exchange and Refund'
    });

    return (
        <Fragment>
            <StoreTitle>{pageTitle}</StoreTitle>
            <Meta name="title" content={pageTitle} />
            <Meta name="description" content={metaDescription} />
            <article className={classes.root} data-cy="ExchangePage-root">
                <div className={classes.headingContainer}>
                    <StyledHeading title={pageTitle} />
                </div>
                <div className={classes.content}>
                    <CmsBlock
                        identifiers="exchange-page-sidebar"
                        classes={{
                            content: classes.sideBannerBlock
                        }}
                    />
                    <div className={classes.formContainer} data-cy="ExchangePage-formContainer">
                        {maybeLoadingIndicator}
                        <CmsBlock
                            identifiers="contact-page-banner"
                            classes={{
                                content: classes.bannerBlock
                            }}
                        />
                        <FormError allowErrorMessages errors={Array.from(errors.values())} />
                        <Form getApi={setFormApi} className={classes.form} onSubmit={handleSubmit}>
                            <Field
                                id="exchange-name"
                                label={formatMessage({
                                    id: 'exchange-page.name',
                                    defaultMessage: 'Name'
                                })}
                            >
                                <TextInput
                                    autoComplete="name"
                                    field="name"
                                    id="exchange-name"
                                    validate={isRequired}
                                    label={formatMessage({
                                        id: 'global.firstName',
                                        defaultMessage: 'First Name'
                                    })}
                                    data-cy="name"
                                />
                            </Field>
                            <Field
                                id="exchange-email"
                                label={formatMessage({
                                    id: 'exchange-page.email',
                                    defaultMessage: 'Email'
                                })}
                            >
                                <TextInput
                                    autoComplete="email"
                                    field="email"
                                    id="exchange-email"
                                    validate={combine([isRequired, isEmail])}
                                    label={formatMessage({
                                        id: 'exchange-page.emailPlaceholder',
                                        defaultMessage: 'Email'
                                    })}
                                    data-cy="email"
                                />
                            </Field>
                            <Field
                                id="exchange-comment"
                                label={formatMessage({
                                    id: 'exchange-page.comment',
                                    defaultMessage: 'Message'
                                })}
                            >
                                <TextArea
                                    autoComplete="comment"
                                    field="comment"
                                    id="exchange-comment"
                                    validate={isRequired}
                                    label={formatMessage({
                                        id: 'exchange-page.commentPlaceholder',
                                        defaultMessage: `Message`
                                    })}
                                    data-cy="comment"
                                />
                            </Field>
                            <div className={classes.buttonsContainer}>
                                <Button priority="high" type="submit" disabled={isBusy} data-cy="submit">
                                    <FormattedMessage id="exchangePage.submit" defaultMessage="Send" />
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </article>
        </Fragment>
    );
};

ExchangePage.propTypes = {
    classes: shape({
        loadingContainer: string,
        banner: string,
        sideContent: string,
        root: string,
        content: string,
        formContainer: string,
        title: string,
        subtitle: string,
        form: string,
        buttonsContainer: string
    })
};

export default ExchangePage;
