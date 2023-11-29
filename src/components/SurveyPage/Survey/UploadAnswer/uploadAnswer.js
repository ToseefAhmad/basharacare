import { useFormApi } from 'informed';
import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { FormattedMessage } from 'react-intl';

import TextInput from '@app/components/overrides/TextInput';

import classes from './uploadAnswer.module.css';

const QUESTION_TYPE = 'file-upload';

const UploadAnswer = ({ questionId, setNextStepEnabled, isRequired }) => {
    const [file, setFile] = useState(null);
    const { setValue } = useFormApi();

    const getBase64 = useCallback(
        file => {
            var reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = function() {
                const value = reader.result.substr(reader.result.indexOf(',') + 1);
                const name = file.name.replace(/[^a-zA-Z0-9.]/g, '_');
                setFile({
                    value,
                    name: name,
                    type: file.type,
                    object: file
                });
                setValue(`q-${questionId}.name`, name);
                setValue(`q-${questionId}.fileType`, file.type);
                setValue(`q-${questionId}.value`, value);
            };
        },
        [questionId, setValue]
    );

    useEffect(() => {
        if (file || !isRequired) {
            setNextStepEnabled();
        }
    }, [setNextStepEnabled, file, isRequired]);

    const onDrop = useCallback(
        files => {
            getBase64(files[0]);
        },
        [getBase64]
    );

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        maxFiles: 1,
        maxSize: 3000000,
        useFsAccessApi: false,
        accept: {
            'image/png': ['.png'],
            'image/jpeg': ['.jpg', '.jpeg']
        }
    });

    return (
        <>
            <div {...getRootProps()} className={classes.root}>
                <input {...getInputProps()} />
                {file && (
                    <p className={classes.preview}>
                        <img src={URL.createObjectURL(file.object)} alt="Uploaded file" />
                        {file.name}
                    </p>
                )}
                {isDragActive ? (
                    <p>
                        <FormattedMessage id="uploadAnswer.dropping" defaultMessage="Drop the files here ..." />
                    </p>
                ) : (
                    <p>
                        <FormattedMessage
                            id="uploadAnswer.drop"
                            defaultMessage="Drag 'n' drop some files here, or click to select files"
                        />
                    </p>
                )}
            </div>
            <div className={classes.hidden}>
                <TextInput field={`q-${questionId}.type`} initialValue={QUESTION_TYPE} hidden={true} />
                <TextInput field={`q-${questionId}.id`} initialValue={questionId} hidden={true} />
                <TextInput field={`q-${questionId}.fileType`} value={file?.type} hidden={true} />
                <TextInput field={`q-${questionId}.name`} value={file?.name} hidden={true} />
                <TextInput field={`q-${questionId}.value`} value={file?.value} hidden={true} />
            </div>
        </>
    );
};

export default UploadAnswer;
