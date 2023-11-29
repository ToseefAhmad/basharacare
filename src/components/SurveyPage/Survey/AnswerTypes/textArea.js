import { useFieldState } from 'informed';
import React, { useEffect } from 'react';

import Field from '@app/components/overrides/Field';
import TextArea from '@app/components/overrides/TextArea';
import TextInput from '@app/components/overrides/TextInput';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

const SurveyTextArea = ({ questionId, setNextStepEnabled, setNextStepDisabled, isRequired: required }) => {
    const field = `q-${questionId}.value`;
    const state = useFieldState(field);

    useEffect(() => {
        if (required && !!state?.value) {
            setNextStepEnabled();
        } else {
            setNextStepDisabled();
        }
    }, [required, setNextStepDisabled, setNextStepEnabled, state]);

    return (
        <>
            <TextArea field={field} isRequired={required} validate={required && isRequired} />
            <Field>
                <TextInput field={`q-${questionId}.type`} initialValue="text" hidden={true} />
            </Field>
            <Field>
                <TextInput field={`q-${questionId}.id`} initialValue={questionId} hidden={true} />
            </Field>
        </>
    );
};

export default SurveyTextArea;
