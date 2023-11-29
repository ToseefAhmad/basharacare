import React, { Fragment, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import { Message } from '@magento/venia-ui/lib/components/Field';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import AccountInformationPageOperations from './accountInformationPage.gql.js';
import defaultClasses from './accountInformationPage.module.css';
import { useAccountInformationPage } from './useAccountInformationPage';

const EditModal = React.lazy(() => import('./editModal.js'));

const AccountInformationPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const genderLabels = [
        formatMessage({
            defaultMessage: 'No Gender Selected',
            id: 'accountInformationPage.noGender'
        }),
        formatMessage({ defaultMessage: 'Male', id: 'global.male' }),
        formatMessage({ defaultMessage: 'Female', id: 'global.female' })
    ];

    const genderValues = [
        { key: '0', value: '0', label: formatMessage({ defaultMessage: 'Select', id: 'global.select' }) },
        { key: '1', value: '1', label: formatMessage({ defaultMessage: 'Male', id: 'global.male' }) },
        { key: '2', value: '2', label: formatMessage({ defaultMessage: 'Female', id: 'global.female' }) }
    ];

    const talonProps = useAccountInformationPage({
        ...AccountInformationPageOperations
    });

    const {
        handleCancel,
        formErrors,
        handleChangePassword,
        handleSubmit,
        initialValues,
        isDisabled,
        isUpdateMode,
        loadDataError,
        shouldShowNewPassword,
        showUpdateMode
    } = talonProps;

    const errorMessage = loadDataError ? (
        <Message>
            <FormattedMessage
                id="accountInformationPage.errorTryAgain"
                defaultMessage="Something went wrong. Please refresh and try again."
            />
        </Message>
    ) : null;

    let pageContent = null;
    if (!initialValues) {
        return fullPageLoadingIndicator;
    } else {
        const { customer } = initialValues;
        const customerName = `${customer.firstname} ${customer.lastname}`;
        const passwordValue = '***********';
        const dateOfBirth = customer.date_of_birth;

        const genderId = customer.gender;
        const gender = genderLabels[genderId || 0];

        pageContent = (
            <Fragment>
                <div className={classes.accountDetails}>
                    <div className={classes.lineItemsContainer}>
                        <span className={classes.nameLabel}>
                            <FormattedMessage id="global.name" defaultMessage="Name" />
                        </span>
                        <span className={classes.nameValue}>{customerName}</span>
                        <span className={classes.emailLabel}>
                            <FormattedMessage id="global.email" defaultMessage="Email" />
                        </span>
                        <span className={classes.emailValue}>{customer.email}</span>
                        <span className={classes.dobLabel}>
                            <FormattedMessage id="global.dob" defaultMessage="Date of Birth" />
                        </span>
                        <span className={classes.dobValue}>{dateOfBirth}</span>
                        <span className={classes.genderLabel}>
                            <FormattedMessage id="global.gender" defaultMessage="Gender" />
                        </span>
                        <span className={classes.dobValue}>{gender}</span>
                        <span className={classes.passwordLabel}>
                            <FormattedMessage id="global.password" defaultMessage="Password" />
                        </span>
                        <span className={classes.passwordValue}>{passwordValue}</span>
                    </div>
                    <div className={classes.editButtonContainer}>
                        <Button
                            className={classes.editInformationButton}
                            disabled={false}
                            onClick={showUpdateMode}
                            priority="normal"
                            data-cy="AccountInformationPage-editInformationButton"
                        >
                            <FormattedMessage id="global.editButton" defaultMessage="Edit" />
                        </Button>
                    </div>
                </div>
                <Suspense fallback={null}>
                    <EditModal
                        formErrors={formErrors}
                        initialValues={customer}
                        isDisabled={isDisabled}
                        isOpen={isUpdateMode}
                        onCancel={handleCancel}
                        onChangePassword={handleChangePassword}
                        onSubmit={handleSubmit}
                        shouldShowNewPassword={shouldShowNewPassword}
                        genderItems={genderValues}
                    />
                </Suspense>
            </Fragment>
        );
    }

    return (
        <AccountPageWrapper pageTitle="Account Information">
            <StoreTitle>
                {formatMessage({
                    id: 'accountInformationPage.titleAccount',
                    defaultMessage: 'Account Information'
                })}
            </StoreTitle>
            <div className={classes.title} data-cy="AccountInformationPage-title">
                <h2>
                    <FormattedMessage id="accountInformationPage.accountInformationTitle" defaultMessage="Account" />
                </h2>
                <h2>
                    <FormattedMessage
                        id="accountInformationPage.accountInformationSecondary"
                        defaultMessage="Information"
                    />
                </h2>
            </div>
            <div className={classes.root}>{errorMessage ? errorMessage : pageContent}</div>
        </AccountPageWrapper>
    );
};

export default AccountInformationPage;
