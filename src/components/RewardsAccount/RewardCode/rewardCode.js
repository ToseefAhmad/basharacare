import { Form } from 'informed';
import { bool, string } from 'prop-types';
import React, { Fragment, useEffect } from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import Field from '@app/components/overrides/Field';
import TextInput from '@app/components/overrides/TextInput';
import { useRewardCodeContext } from '@app/components/RewardsAccount/RewardCode/context';
import { useToasts } from '@magento/peregrine/lib/Toasts/useToasts';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './rewardCode.module.css';

const errorIcon = (
    <Icon
        src={AlertCircleIcon}
        attrs={{
            width: 18
        }}
    />
);

const RewardCode = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useRewardCodeContext();
    const [, { addToast }] = useToasts();
    const {
        setFormApi,
        initialValues,
        applyingRewardCode,
        data,
        errors,
        handleSubmit,
        handleRemove,
        handleChange,
        removingRewardCode,
        isSendRewardCode
    } = talonProps;

    const { formatMessage } = useIntl();

    const removeRewardCodeError = deriveErrorMessage([errors.get('removeRewardCodeMutation')]);

    useEffect(() => {
        if (removeRewardCodeError) {
            addToast({
                type: 'error',
                icon: errorIcon,
                message: removeRewardCodeError,
                dismissable: true,
                timeout: 10000
            });
        }
        if (isSendRewardCode) {
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'rewardCode.successMessage',
                    defaultMessage: 'Reward Points have been applied.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, isSendRewardCode, removeRewardCodeError]);

    if (!data) {
        return null;
    }

    if (errors.get('getAppliedRewardCodesQuery')) {
        return (
            <div className={classes.errorContainer}>
                <FormattedMessage
                    id="rewardCode.errorContainer"
                    defaultMessage="Something went wrong. Please refresh and try again."
                />
            </div>
        );
    }

    const { spend, spend_max_points } = data.cart.applied_rewards;

    const removeButton = spend ? (
        <div className={classes.appliedRewardCode}>
            <Fragment key={spend}>
                <Button
                    priority="high"
                    data-cy="RewardCode-removeRewardCodeButton"
                    disabled={removingRewardCode}
                    onClick={() => {
                        handleRemove(spend);
                    }}
                >
                    <FormattedMessage id="rewardCode.removeButton" defaultMessage="Cancel Points" />
                </Button>
            </Fragment>
        </div>
    ) : null;

    const errorMessage = deriveErrorMessage([errors.get('applyRewardCodeMutation')]);

    const formClass = errorMessage ? classes.entryFormError : classes.entryForm;

    const { reward } = data;

    return (
        <Form
            getApi={setFormApi}
            onValueChange={handleChange}
            className={formClass}
            initialValues={initialValues}
            onSubmit={handleSubmit}
        >
            <div>
                <FormattedMessage
                    id="revardCode.points"
                    defaultMessage="You have <b>{amount} Reward Points </b> available."
                    values={{
                        b: chunks => <strong>{chunks}</strong>,
                        amount: reward.amount || 0
                    }}
                />
            </div>
            <Field
                classes={{ root: classes.couponFieldEnterCode, label: classes.fieldLabel }}
                field="rewardCode"
                data-cy="RewardCode-rewardCode"
                label={formatMessage({
                    id: 'cartPage.rewardCode',
                    defaultMessage: 'Reward Points'
                })}
            >
                <TextInput
                    field="rewardCode"
                    id="rewardCode"
                    data-cy="RewardCode- RewardCode"
                    placeholder={formatMessage({
                        id: 'rewardCode.enterCode',
                        defaultMessage: 'Enter points'
                    })}
                    mask={value => value && value.trim() && value.replace(/[^0-9]/g, '')}
                    maskOnBlur={true}
                    message={errorMessage}
                />
            </Field>
            <Field className={classes.option}>
                <Checkbox
                    field="useMaxRewardCode"
                    data-cy="RewardCode-rewardMaxReceipt"
                    label={
                        <FormattedMessage
                            id="rewardCode.rewardMaxReceipt"
                            defaultMessage="Use maximum {points} Reward Points"
                            values={{ points: spend_max_points }}
                        />
                    }
                />
            </Field>
            <Field classes={{ root: classes.rewardFieldApply }}>
                {removeButton}
                <Button data-cy="RewardCode-submit" disabled={applyingRewardCode} priority="high" type="submit">
                    <FormattedMessage id="rewardCode.apply" defaultMessage="Apply Points" />
                </Button>
            </Field>
        </Form>
    );
};

RewardCode.propTypes = {
    rewardCode: string,
    useMaxRewardCode: bool
};

RewardCode.defaultProps = {
    rewardCode: '',
    useMaxRewardCode: false
};

export default RewardCode;
