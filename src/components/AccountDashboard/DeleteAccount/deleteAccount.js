import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import Dialog from '@app/components/overrides/Dialog';
import StyledHeading from '@app/components/StyledHeading';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './deleteAccount.module.css';
import { useDeleteAccount } from './useDeleteAccount';

export const DeleteAccount = () => {
    const { formatMessage } = useIntl();
    const { isDialogOpen, loading, setIsDialogOpen, handleSubmit } = useDeleteAccount();
    return (
        <div>
            {loading && fullPageLoadingIndicator}
            <StyledHeading
                title={formatMessage({
                    id: 'deleteAccount.title',
                    defaultMessage: 'Delete Account'
                })}
                classes={{
                    heading: classes.title
                }}
            />
            <p>
                <FormattedMessage
                    id="deleteAccount.description"
                    defaultMessage="Your account will be peramanently deleted. Data will not be recoverable after this action. After deletion you can recreate your account, but no data will persist"
                />
            </p>
            <div className={classes.buttonContainer}>
                <Button onClick={() => setIsDialogOpen(true)}>
                    <FormattedMessage id="deleteAccount.button" defaultMessage="Delete your account" />
                </Button>
            </div>
            <Dialog
                isOpen={isDialogOpen}
                confirmTranslationId="global.yes"
                confirmText="Yes"
                cancelText="Cancel"
                cancelTextTranslationId="global.cancel"
                onConfirm={handleSubmit}
                onCancel={() => setIsDialogOpen(false)}
                title={formatMessage({
                    id: 'deleteAccount.button',
                    defaultMessage: 'Delete your account'
                })}
            >
                <span>
                    <FormattedMessage
                        id="deleteAccount.dialogDescription"
                        defaultMessage="Are you sure you want to delete your account?"
                    />
                </span>
            </Dialog>
        </div>
    );
};
