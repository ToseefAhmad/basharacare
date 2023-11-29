import { useFormState } from 'informed';
import React, { useCallback, useRef } from 'react';

import classes from '../../surveyPage.module.css';

import Checkbox from '@app/components/overrides/Checkbox';
import Field from '@app/components/overrides/Field';
import Image from '@app/components/overrides/Image/image';
import TextArea from '@app/components/overrides/TextArea';
import TextInput from '@app/components/overrides/TextInput';

const CheckboxContainer = ({ handleOnContainerClick, values, isDisabled, handleOnChange, questionId, answer }) => {
    const inputRef = useRef();

    const handleContainerClick = useCallback(
        answerId => e => {
            if (inputRef?.current !== e.target && !inputRef?.current.contains(e.target) && !isDisabled) {
                e.preventDefault();
                e.stopPropagation();
                handleOnContainerClick(
                    `q-${questionId}.a-${answerId}`,
                    !values?.[`q-${questionId}`]?.[`a-${answerId}`]
                );
            }
        },
        [handleOnContainerClick, questionId, values, isDisabled]
    );
    return (
        <div
            key={answer.answer_id}
            className={classes.imageAnswer}
            onMouseDown={handleContainerClick(answer.answer_id)}
            aria-hidden="true"
            role="button"
            tabIndex={0}
        >
            {answer.image && (
                <Image
                    classes={{ container: classes.loadedImage, image: classes.answerImage }}
                    src={answer.image}
                    height={157}
                    width={157}
                />
            )}
            <Checkbox
                rootRef={inputRef}
                key={answer.answer_id}
                classes={{ root: classes.imageCheckbox }}
                field={`q-${questionId}.a-${answer.answer_id}`}
                label={answer.title}
                disabled={isDisabled}
                onChange={e => {
                    handleOnChange(e.target);
                }}
            />
            <p className={classes.imageAnswerDescription}>{answer.description}</p>
        </div>
    );
};

export const ImageCheckbox = ({
    answers,
    questionId,
    handleOnContainerClick,
    handleOnChange,
    maxAnswers,
    hasOtherField,
    checkedCount,
    type
}) => {
    const { values } = useFormState();

    return (
        <>
            <div className={classes.imageAnswerContainer}>
                <div className={classes.radioGroup}>
                    {answers.map(answer => {
                        const isDisabled =
                            maxAnswers &&
                            !values?.[`q-${questionId}`]?.[`a-${answer.answer_id}`] &&
                            maxAnswers <= checkedCount;
                        return (
                            <CheckboxContainer
                                handleOnChange={handleOnChange}
                                handleOnContainerClick={handleOnContainerClick}
                                answer={answer}
                                questionId={questionId}
                                key={answer.answer_id}
                                isDisabled={isDisabled}
                                values={values}
                            />
                        );
                    })}
                </div>
            </div>
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
            <Field>
                <TextInput field={`q-${questionId}.type`} initialValue={type} hidden={true} />
            </Field>
            <Field>
                <TextInput field={`q-${questionId}.id`} initialValue={questionId} hidden={true} />
            </Field>
        </>
    );
};
