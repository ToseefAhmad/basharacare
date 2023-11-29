import { Form } from 'informed';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import ContainerLoadingIndicator from '../ContainerLoadingIndicator';
import Button from '../overrides/Button';
import Field from '../overrides/Field';
import TextInput from '../overrides/TextInput';

import classes from './storeCreditForm.module.css';
import { useStoreCreditForm } from './useStoreCreditForm';

const StoreCreditForm = ({ appliedAmount }) => {
    const { handleSubmit, availableCredit, hasValue, loading, setFormApi, onInputChange } = useStoreCreditForm({
        appliedAmount
    });
    return (
        <Form onSubmit={handleSubmit} getApi={setFormApi} className={classes.form}>
            {loading && (
                <ContainerLoadingIndicator global={true}>
                    <FormattedMessage id="storeCreditForm.loading" defaultMessage="Applying Store Credits" />
                </ContainerLoadingIndicator>
            )}
            <span className={classes.label}>
                <FormattedMessage
                    defaultMessage="Your current balance is: {availableCredit}"
                    values={{
                        availableCredit
                    }}
                    id="storeCreditForm.availableCredit"
                />
            </span>
            {!appliedAmount && (
                <Field>
                    <TextInput onChange={onInputChange} type="number" field="amount" />
                </Field>
            )}
            <Button
                type="submit"
                classes={{
                    root_normalPriority: classes.root_normalPriority
                }}
            >
                {(appliedAmount && <FormattedMessage defaultMessage="Cancel" id="global.cancel" />) ||
                    (hasValue && (
                        <FormattedMessage defaultMessage="Use Store Credit" id="storeCreditForm.submitForm" />
                    )) || <FormattedMessage defaultMessage="Use max store credit" id="storeCreditForm.useMaxLabel" />}
            </Button>
        </Form>
    );
};

export default StoreCreditForm;
