import React from 'react';
import { FormattedMessage } from 'react-intl';

import classes from './transactionRow.module.css';

const TransactionRow = ({ transaction, formatBalance }) => {
    const { transaction_id, created_at, balance_delta, balance_amount, currency_code, message } = transaction || {};
    const currentBalance = balance_amount ? balance_amount.value : null;
    // Convert date to ISO-8601 format so Safari can also parse it
    const isoFormattedDate = created_at.replace(' ', 'T');
    const formattedDate = new Date(isoFormattedDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const balanceChangeClass = balance_delta.value < 0 ? classes.negativeBalance : classes.positiveBalance;

    return (
        <li className={classes.root}>
            <div className={classes.transactionIdContainer}>
                <span className={classes.transactionIdLabel}>
                    <FormattedMessage id="transactionRow.transactionIdText" defaultMessage="Transaction#" />
                </span>
                <span className={classes.transactionId}>{transaction_id}</span>
            </div>
            <div className={classes.transactionDateContainer}>
                <span className={classes.transactionDateLabel}>
                    <FormattedMessage id="transactionRow.transactionDateText" defaultMessage="Date" />
                </span>
                <span className={classes.transactionDate}>{formattedDate}</span>
            </div>
            <div className={classes.balanceChangeContainer}>
                <span className={classes.balanceChangeLabel}>
                    <FormattedMessage id="transactionRow.balanceChangeLabel" defaultMessage="Balance Change" />
                </span>
                <span className={balanceChangeClass}>{formatBalance(currency_code, balance_delta.value, true)}</span>
            </div>
            <div className={classes.balanceLeftContainer}>
                <span className={classes.balanceLeftLabel}>
                    <FormattedMessage id="transactionRow.balanceLeft" defaultMessage="Balance" />
                </span>
                <div className={classes.balanceLeft}>{formatBalance(currency_code, currentBalance)}</div>
            </div>
            <div className={classes.additionalMessageContainer}>
                <span className={classes.additionalMessageLabel}>
                    <FormattedMessage id="transactionRow.additionalMessageText" defaultMessage="Additional Message" />
                </span>
                <div className={classes.additionalMessage}>{message}</div>
            </div>
        </li>
    );
};

export default TransactionRow;
