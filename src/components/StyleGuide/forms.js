import { Form } from 'informed';
import React from 'react';

import Button from '@app/components/overrides/Button';
import TextArea from '@app/components/overrides/TextArea';
import TextInput from '@app/components/overrides/TextInput';
import Field from '@magento/venia-ui/lib/components/Field';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './forms.module.css';

const Forms = () => (
    <div className={classes.root}>
        <p className={classes.label}>Forms</p>
        <Form className={classes.form}>
            <Field>
                <TextInput field="first_name" label="First Name" />
            </Field>
            <Field>
                <TextInput field="last_name" label="Last Name" validate={isRequired} validateOnChange={true} />
            </Field>
            <Field>
                <TextArea field="text_area" label="Message" />
            </Field>
            <Field>
                <TextArea field="text_area2" label="Message" validate={isRequired} />
            </Field>
            <Button fullWidth={true} type="submit" priority="normal">
                Submit
            </Button>
        </Form>
    </div>
);

export default Forms;
