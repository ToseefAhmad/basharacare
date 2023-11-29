import { Form } from 'informed';
import { shape, string } from 'prop-types';
import React, { Fragment, useEffect, useLayoutEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '../Button';

import CmsBlock from '@app/components/overrides/CmsBlock';
import StyledHeading from '@app/components/StyledHeading';
import { useAppContext } from '@app/context/App';
import { isEmail } from '@app/util/formValidator';
import { useToasts } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import Field from '@magento/venia-ui/lib/components/Field';
import { Meta, StoreTitle } from '@magento/venia-ui/lib/components/Head';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './contactPage.module.css';
import { useContactPage } from './useContactPage';

const BANNER_IDENTIFIER = 'contact-page-banner';
const SIDEBAR_IDENTIFIER = 'contact-page-sidebar';
const NOT_FOUND_MESSAGE = "Looks like the page you were hoping to find doesn't exist. Sorry about that.";

const ContactPage = props => {
    const { classes: propClasses } = props;
    const classes = useStyle(defaultClasses, propClasses);
    const [, { setIsPageFullWidth }] = useAppContext();
    const { formatMessage } = useIntl();
    const talonProps = useContactPage({
        cmsBlockIdentifiers: [BANNER_IDENTIFIER, SIDEBAR_IDENTIFIER]
    });
    const [, { addToast }] = useToasts();

    useLayoutEffect(() => {
        setIsPageFullWidth(true);
        return () => setIsPageFullWidth(false);
    }, [setIsPageFullWidth]);

    const { isEnabled, handleSubmit, isBusy, isLoading, setFormApi, response } = talonProps;

    useEffect(() => {
        if (response && response.status) {
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'contactPage.submitMessage',
                    defaultMessage: 'Your message has been sent.'
                })
            });
        }
    }, [addToast, formatMessage, response]);

    useEffect(() => {
        document.body.classList.add('contact-us');
        return () => globalThis.document.body.classList.remove('contact-us');
    }, []);

    if (!isLoading && !isEnabled) {
        return (
            <Fragment>
                <StoreTitle>
                    {formatMessage({
                        id: 'contactPage.title',
                        defaultMessage: 'Contact Us'
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
                    <FormattedMessage id="contactPage.loading" defaultMessage="Loading Contact Page" />
                </LoadingIndicator>
            </div>
        );
    }

    const maybeLoadingIndicator = isBusy ? (
        <div className={classes.submitLoadingContainer}>
            <LoadingIndicator>
                <FormattedMessage id="contactPage.loadingText" defaultMessage="Sending" />
            </LoadingIndicator>
        </div>
    ) : null;

    const pageTitle = formatMessage({
        id: 'contactPage.title',
        defaultMessage: 'Contact Us'
    });

    const metaDescription = formatMessage({
        id: 'contactPage.metaDescription',
        defaultMessage: 'Contact Us'
    });

    return (
        <Fragment>
            <StoreTitle>{pageTitle}</StoreTitle>
            <Meta name="title" content={pageTitle} />
            <Meta name="description" content={metaDescription} />
            <article className={classes.root} data-cy="ContactPage-root">
                <div className={classes.headingContainer}>
                    <StyledHeading title={pageTitle} />
                </div>
                <div className={classes.content}>
                    <CmsBlock
                        identifiers="contact-page-sidebar"
                        classes={{
                            content: classes.sideBannerBlock
                        }}
                    />
                    <div className={classes.formContainer} data-cy="ContactPage-formContainer">
                        {maybeLoadingIndicator}
                        <CmsBlock
                            identifiers="contact-page-banner"
                            classes={{
                                content: classes.bannerBlock
                            }}
                        />
                        <Form getApi={setFormApi} className={classes.form} onSubmit={handleSubmit}>
                            <Field
                                id="contact-name"
                                label={formatMessage({
                                    id: 'contact-page.name',
                                    defaultMessage: 'Name'
                                })}
                            >
                                <TextInput
                                    autoComplete="name"
                                    field="name"
                                    id="contact-name"
                                    validate={isRequired}
                                    label={formatMessage({
                                        id: 'global.firstName',
                                        defaultMessage: 'First Name'
                                    })}
                                    data-cy="name"
                                />
                            </Field>
                            <Field
                                id="contact-email"
                                label={formatMessage({
                                    id: 'contact-page.email',
                                    defaultMessage: 'Email'
                                })}
                            >
                                <TextInput
                                    autoComplete="email"
                                    field="email"
                                    id="contact-email"
                                    validate={combine([isRequired, isEmail])}
                                    label={formatMessage({
                                        id: 'contact-page.emailPlaceholder',
                                        defaultMessage: 'Email'
                                    })}
                                    data-cy="email"
                                />
                            </Field>
                            <Field
                                id="contact-comment"
                                label={formatMessage({
                                    id: 'contact-page.comment',
                                    defaultMessage: 'Message'
                                })}
                            >
                                <TextArea
                                    autoComplete="comment"
                                    field="comment"
                                    id="contact-comment"
                                    validate={isRequired}
                                    label={formatMessage({
                                        id: 'contact-page.commentPlaceholder',
                                        defaultMessage: `Message`
                                    })}
                                    data-cy="comment"
                                />
                            </Field>
                            <div className={classes.buttonsContainer}>
                                <Button priority="high" type="submit" disabled={isBusy} data-cy="submit">
                                    <FormattedMessage id="contactPage.submit" defaultMessage="Send" />
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
            </article>
        </Fragment>
    );
};

ContactPage.propTypes = {
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

export default ContactPage;
