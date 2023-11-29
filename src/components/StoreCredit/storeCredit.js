import { Form } from 'informed';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import TransactionRow from '@app/components/StoreCredit/transactionRow';
import useStoreCredit from '@app/components/StoreCredit/useStoreCredit';
import { useToasts } from '@magento/peregrine';
import Button from '@magento/venia-ui/lib/components/Button';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import FormError from '@magento/venia-ui/lib/components/FormError';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './storeCredit.module.css';

const StoreCredit = () => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const afterSubmit = useCallback(() => {
        addToast({
            type: 'info',
            message: formatMessage({
                id: 'storeCredit.preferencesText',
                defaultMessage: 'Your preferences have been updated.'
            })
        });
    }, [addToast, formatMessage]);

    const {
        customerCreditData,
        formErrors,
        handleSubmit,
        initialValues,
        isSubmitting,
        transactions,
        formatBalance
    } = useStoreCredit({
        afterSubmit
    });

    const { balance } = customerCreditData;

    const [showButton, setShowButton] = useState(false);

    const submitButtonRef = useRef();

    const handleChange = () => {
        setShowButton(!showButton);
    };

    const buttonClass = showButton ? classes.visibleButton : classes.hiddenButton;

    const transactionHistoryRows = useMemo(() => {
        return transactions.map(transaction => {
            return (
                <TransactionRow
                    key={transaction.transaction_id}
                    transaction={transaction}
                    formatBalance={formatBalance}
                />
            );
        });
    }, [formatBalance, transactions]);

    if (!initialValues) {
        return (
            <LoadingIndicator>
                <FormattedMessage id="storeCredit.loadingText" defaultMessage="Loading Information" />
            </LoadingIndicator>
        );
    }

    const formattedBalance = formatBalance(balance.currency_code, balance.amount.value);
    const hasSeveralBalances = balance ? (
        <FormattedMessage
            id="storeCredit.creditsInAnotherCurrency"
            defaultMessage="* Also you have credits in another currency "
        />
    ) : (
        ''
    );

    const tableHeader = transactions.length ? (
        <div className={classes.tableHeader}>
            <span>
                <FormattedMessage id="storeCredit.transactionLabel" defaultMessage="Transaction#" />
            </span>
            <span>
                <FormattedMessage id="storeCredit.dateLabel" defaultMessage="Date" />
            </span>
            <span>
                <FormattedMessage id="storeCredit.balanceChangeLabel" defaultMessage="Balance Change" />
            </span>
            <span>
                <FormattedMessage id="storeCredit.balanceLabel" defaultMessage="Balance" />
            </span>
            <span>
                <FormattedMessage id="storeCredit.additionalMessageLabel" defaultMessage="Addtional Message" />
            </span>
        </div>
    ) : (
        <div>
            <FormattedMessage id="storeCredit.noTransactions" defaultMessage="There are no transactions yet." />
        </div>
    );

    return (
        <div>
            <h2>
                <FormattedMessage id="storeCredit.title" defaultMessage="Balance" />
            </h2>
            <div className={classes.creditBalanceContainer}>
                <FormattedMessage
                    id="storeCredit.amountText"
                    defaultMessage="Current credit balance : {formattedBalance} "
                    values={{ formattedBalance }}
                />
                <p>{hasSeveralBalances}</p>
            </div>
            <div>
                <div className={classes.transactionHistoryTitle}>
                    <div>
                        <h2>
                            <FormattedMessage id="storeCredit.transactionHistoryTitle" defaultMessage="Transaction" />
                        </h2>
                        <h2>
                            <FormattedMessage
                                id="storeCredit.transactionHistorySecondaryTitle"
                                defaultMessage="History"
                            />
                        </h2>
                    </div>
                    <div className={classes.subscribeForm}>
                        <FormError errors={formErrors} />
                        <Form className={classes.form} onSubmit={handleSubmit} initialValues={initialValues}>
                            <Checkbox
                                field="isSubscribed"
                                label={formatMessage({
                                    id: 'storeCredit.subscribeText',
                                    defaultMessage: 'Subscribe To Email Notifications'
                                })}
                                onChange={handleChange}
                            />
                            <div className={buttonClass}>
                                <Button disabled={isSubmitting} ref={submitButtonRef} type="submit" priority="high">
                                    {isSubmitting
                                        ? formatMessage({
                                              id: 'communicationsPage.savingText',
                                              defaultMessage: 'Saving'
                                          })
                                        : formatMessage({
                                              id: 'communicationsPage.changesText',
                                              defaultMessage: 'Save Changes'
                                          })}
                                </Button>
                            </div>
                        </Form>
                    </div>
                </div>
                {tableHeader}
                <ul className={classes.transactionHistoryTable}>{transactionHistoryRows}</ul>
            </div>
        </div>
    );
};

export default StoreCredit;
