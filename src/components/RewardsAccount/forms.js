import { Form } from 'informed';
import { shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import TextArea from '@app/components/overrides/TextArea';
import TextInput from '@app/components/overrides/TextInput';
import defaultClasses from '@app/components/RewardsAccount/forms.module.css';
import { useRewardsAccount } from '@app/components/RewardsAccount/useRewardsAccount';
import { useStyle } from '@magento/venia-ui/lib/classify';
import FormError from '@magento/venia-ui/lib/components/FormError';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

const Forms = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const { errors, handleSubmit, isBusy, setFormApi } = useRewardsAccount(props);

    const maybeLoadingIndicator = isBusy ? (
        <div className={classes.loadingContainer}>
            <LoadingIndicator>
                <FormattedMessage id="rewardPage.loadingText" defaultMessage="Sending" />
            </LoadingIndicator>
        </div>
    ) : null;

    return (
        <>
            <div className={classes.root}>
                <strong className={classes.title}>
                    <FormattedMessage id="rewardPage.titleText" defaultMessage="My Referrals" />
                </strong>
                <div className={classes.titleSecondary}>
                    <FormattedMessage id="rewardPage.titleTextSecondary" defaultMessage="Send Invitation" />
                </div>
                <p className={classes.subText}>
                    <FormattedMessage
                        id="rewardPage.subtext"
                        defaultMessage="Enter contacts of your friends to invite them."
                    />
                </p>

                <FormError allowErrorMessages errors={Array.from(errors.values())} />
                <Form getApi={setFormApi} className={classes.form} onSubmit={handleSubmit}>
                    {maybeLoadingIndicator}
                    <TextInput
                        label={formatMessage({
                            id: 'global.name',
                            defaultMessage: 'Name'
                        })}
                        autoComplete="name"
                        field="name"
                        validate={isRequired}
                        data-cy="name"
                    />

                    <TextInput
                        label={formatMessage({
                            id: 'global.email',
                            defaultMessage: 'Email'
                        })}
                        autoComplete="email"
                        field="email"
                        validate={isRequired}
                        data-cy="email"
                    />
                    <TextArea
                        label={formatMessage({
                            id: 'global.message',
                            defaultMessage: 'Message'
                        })}
                        field="message"
                        validate={isRequired}
                        data-cy="message"
                    />
                    <Button fullWidth={true} type="submit" priority="high" disabled={isBusy}>
                        <FormattedMessage id="rewardPage.submitButtonText" defaultMessage="Send invitation" />
                    </Button>
                </Form>
            </div>
            {!isBusy && props.children}
        </>
    );
};

Forms.propTypes = {
    classes: shape({
        root: string,
        form: string,
        title: string,
        loadingContainer: string
    })
};

export default Forms;
