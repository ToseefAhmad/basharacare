import { useFormApi, useFormState } from 'informed';
import React, { useCallback, useEffect, useState } from 'react';

import classes from '../surveyPage.module.css';

import TextInput from '@app/components/overrides/TextInput';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import RadioGroup from '@magento/venia-ui/lib/components/RadioGroup';
import Radio from '@magento/venia-ui/lib/components/RadioGroup/radio';
import TextArea from '@magento/venia-ui/lib/components/TextArea';

import { ImageCheckbox } from './AnswerTypes/imageCheckbox';
import { ImageRadio } from './AnswerTypes/imageRadio';
import SurveyTextArea from './AnswerTypes/textArea';
import UploadAnswer from './UploadAnswer';

const Answers = ({
    questionId,
    answers,
    type,
    isRequired,
    maxAnswers,
    hasOtherField,
    setNextStepDisabled,
    setNextStepEnabled
}) => {
    const { values } = useFormState();
    const [checkedCount, setCheckedCount] = useState(0);
    const { setValue } = useFormApi();

    useEffect(() => {
        if (isRequired && (!type.includes('upload') && !type.includes('text'))) {
            if (checkedCount === 0) {
                setNextStepDisabled();
            } else {
                setNextStepEnabled();
            }
        } else if (!isRequired) {
            setNextStepEnabled();
        }
    }, [checkedCount, isRequired, setNextStepDisabled, setNextStepEnabled, type]);

    const handleOnChange = field => {
        field.checked ? setCheckedCount(checkedCount + 1) : setCheckedCount(checkedCount - 1);
    };

    const handleOnContainerClick = useCallback(
        (field, value) => {
            setCheckedCount(checkedCount + (value ? 1 : -1));
            setValue(field, value);
        },
        [checkedCount, setValue]
    );

    switch (type) {
        case 'radio':
            return (
                <>
                    <RadioGroup field={`q-${questionId}.a`} classes={{ root: classes.regularRadioGroup }}>
                        {answers.map(answer => {
                            return (
                                <button
                                    className={classes.containerButton}
                                    key={answer.answer_id}
                                    type="button"
                                    onClick={() => handleOnContainerClick(`q-${questionId}.a`, answer.answer_id)}
                                >
                                    <Radio
                                        key={answer.answer_id}
                                        id={answer.answer_id}
                                        label={answer.title}
                                        value={answer.answer_id}
                                        classes={{ label: classes.radioLabel }}
                                        onChange={e => handleOnChange(e.target)}
                                    />
                                    <p className={classes.answerDescription}>{answer.description}</p>
                                </button>
                            );
                        })}
                    </RadioGroup>
                    <Field>
                        <TextInput field={`q-${questionId}.type`} initialValue={type} hidden={true} />
                    </Field>
                    <Field>
                        <TextInput field={`q-${questionId}.id`} initialValue={questionId} hidden={true} />
                    </Field>
                </>
            );
        case 'checkbox':
            return (
                <>
                    {answers.map(answer => {
                        const isDisabled =
                            maxAnswers &&
                            !values?.[`q-${questionId}`]?.[`a-${answer.answer_id}`] &&
                            maxAnswers <= checkedCount;
                        return (
                            <>
                                <Checkbox
                                    key={answer.answer_id}
                                    field={`q-${questionId}.a-${answer.answer_id}`}
                                    label={answer.title}
                                    checked={values?.[`q-${questionId}`]?.[`a-${answer.answer_id}`]}
                                    disabled={isDisabled}
                                    classes={{ root: classes.checkboxRoot }}
                                    onChange={e => handleOnChange(e.target)}
                                >
                                    <p className={classes.answerCheckboxDescription}>{answer.description}</p>
                                </Checkbox>
                            </>
                        );
                    })}
                    {hasOtherField && (
                        <TextArea
                            classes={{
                                container: classes.textAreaContainer,
                                input: classes.textAreaInput
                            }}
                            field={`q-${questionId}.other`}
                            label="Other"
                        />
                    )}
                    <TextInput field={`q-${questionId}.type`} initialValue={type} hidden={true} />
                    <TextInput field={`q-${questionId}.id`} initialValue={questionId} hidden={true} />
                </>
            );
        case 'image-radio':
            return (
                <ImageRadio
                    questionId={questionId}
                    answers={answers}
                    handleOnContainerClick={handleOnContainerClick}
                    handleOnChange={handleOnChange}
                    hasOtherField={hasOtherField}
                    type={type}
                />
            );
        case 'image-checkbox':
            return (
                <ImageCheckbox
                    questionId={questionId}
                    answers={answers}
                    handleOnContainerClick={handleOnContainerClick}
                    handleOnChange={handleOnChange}
                    maxAnswers={maxAnswers}
                    hasOtherField={hasOtherField}
                    checkedCount={checkedCount}
                    type={type}
                />
            );
        case 'text':
            return (
                <SurveyTextArea
                    questionId={questionId}
                    isRequired={isRequired}
                    setNextStepEnabled={setNextStepEnabled}
                    setNextStepDisabled={setNextStepDisabled}
                />
            );
        case 'file-upload':
            return (
                <UploadAnswer questionId={questionId} isRequired={isRequired} setNextStepEnabled={setNextStepEnabled} />
            );
        default:
            return null;
    }
};

export default Answers;
