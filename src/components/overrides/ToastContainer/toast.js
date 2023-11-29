import classnames from 'classnames';
import { bool, node, func, string, number, oneOfType, object } from 'prop-types';
import React, { useMemo } from 'react';
import { AlertCircle as AlertCircleIcon, CheckCircle as CheckCircleICon } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import { Meta } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './toast.module.css';

const Toast = ({
    dismissable,
    icon,
    message,
    onDismiss,
    handleDismiss,
    type,
    timeout,
    hasDismissAction,
    dismissActionText,
    onAction,
    handleAction,
    actionText
}) => {
    const iconElement = useMemo(() => {
        if (icon) {
            return icon;
        }
        if (!icon) {
            if (type === 'success') {
                return (
                    <Icon
                        src={CheckCircleICon}
                        attrs={{
                            width: 18
                        }}
                    />
                );
            } else {
                return (
                    <Icon
                        src={AlertCircleIcon}
                        attrs={{
                            width: 18
                        }}
                    />
                );
            }
        }
    }, [icon, type]);

    const controls =
        onDismiss || dismissable ? (
            <button className={classes.dismissButton} onClick={handleDismiss}>
                <FormattedMessage id="toast.close" defaultMessage="Close" />
            </button>
        ) : null;

    const dismissActionButton =
        hasDismissAction && (onDismiss || dismissable) ? (
            <button data-cy="Toast-dismissActionButton" className={classes.actionButton} onClick={handleDismiss}>
                {dismissActionText}
            </button>
        ) : null;

    const actions = onAction ? (
        <div className={classes.actions}>
            {dismissActionButton}
            <button data-cy="Toast-actionButton" className={classes.actionButton} onClick={handleAction}>
                {actionText}
            </button>
        </div>
    ) : null;

    return (
        <div className={classnames(classes.root, classes[`${type}Toast`])}>
            {type === 'error' && <Meta name="prerender-status-code" content="500" />}
            <div className={classes.container}>
                <div className={classes.messageContainer}>
                    {iconElement}
                    <div className={classes.message}>{message}</div>
                </div>
                {actions}
                <div className={classes.controls}>{controls}</div>
            </div>
            {timeout && <div className={classes.progress} style={{ animationDuration: `${timeout}ms` }} />}
        </div>
    );
};

Toast.propTypes = {
    dismissable: bool,
    icon: node,
    message: oneOfType([string, object]),
    onDismiss: func,
    handleDismiss: func,
    type: string,
    timeout: oneOfType([number, bool])
};

Toast.defaultProps = {
    dismissable: true
};

export default Toast;
