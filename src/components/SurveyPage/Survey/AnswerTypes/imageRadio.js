import React, { useCallback, useRef } from 'react';

import classes from '../../surveyPage.module.css';

import Field from '@app/components/overrides/Field';
import Image from '@app/components/overrides/Image/image';
import TextArea from '@app/components/overrides/TextArea';
import TextInput from '@app/components/overrides/TextInput';
import RadioGroup from '@magento/venia-ui/lib/components/RadioGroup';
import Radio from '@magento/venia-ui/lib/components/RadioGroup/radio';

const RadioContainer = ({ handleOnContainerClick, questionId, answer, handleOnChange }) => {
    const inputRef = useRef();

    const handleContainerClick = useCallback(
        answerId => e => {
            if (inputRef?.current !== e.target && !inputRef?.current?.contains(e.target)) {
                e.preventDefault();
                e.stopPropagation();
                handleOnContainerClick(`q-${questionId}.a`, answerId);
            }
        },
        [handleOnContainerClick, questionId]
    );

    return (
        <div
            key={answer.answer_id}
            className={classes.imageAnswer}
            onClick={handleContainerClick(answer.answer_id)}
            aria-hidden="true"
            role="button"
            tabIndex={0}
        >
            {answer.image && (
                <Image
                    classes={{ container: classes.loadedImage, image: classes.answerImage }}
                    src={answer.image}
                    width={157}
                    height={157}
                />
            )}
            <Radio
                rootRef={inputRef}
                key={answer.answer_id}
                id={answer.answer_id}
                label={answer.title}
                value={answer.answer_id}
                classes={{ label: classes.radioLabel }}
                onChange={e => handleOnChange(e.target)}
            />
            <p className={classes.imageAnswerDescription}>{answer.description}</p>
        </div>
    );
};

export const ImageRadio = ({ answers, questionId, handleOnContainerClick, handleOnChange, hasOtherField, type }) => {
    return (
        <>
            <div className={classes.imageAnswerContainer}>
                <RadioGroup field={`q-${questionId}.a`} classes={{ root: classes.radioGroup }}>
                    {answers.map(answer => {
                        return (
                            <RadioContainer
                                key={answer.answer_id}
                                answer={answer}
                                questionId={questionId}
                                handleOnContainerClick={handleOnContainerClick}
                                handleOnChange={handleOnChange}
                            />
                        );
                    })}
                </RadioGroup>
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
