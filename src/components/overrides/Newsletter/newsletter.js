import { Form } from 'informed';
import { shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { Arrow } from '@app/components/Icons';
import { isEmail } from '@app/util/formValidator';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import Field from '@magento/venia-ui/lib/components/Field';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import defaultClasses from './newsletter.module.css';
import { useNewsletter } from './useNewsletter';

const Newsletter = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { handleSubmit, setFormApi } = useNewsletter();
    const { formatMessage } = useIntl();

    return (
        <div id="newsletter" className={classes.root}>
            <div className={classes.newsletterContainer}>
                <CmsBlock
                    identifiers="newsletterText"
                    classes={{
                        root: '',
                        content: classes.content
                    }}
                />
                <div className={classes.input}>
                    <Form getApi={setFormApi} className={classes.form} onSubmit={handleSubmit}>
                        <Field id="email" optional={true} className={classes.field}>
                            <TextInput
                                autoComplete="email"
                                field="email"
                                id="email"
                                label={formatMessage({
                                    id: 'subscribe.enterEmail',
                                    defaultMessage: 'Enter Your Email'
                                })}
                                validate={combine([isRequired, isEmail])}
                            />
                        </Field>
                        <Button priority="high" type="submit" aria-label="Newsletter Submit" className={classes.button}>
                            <div className={classes.buttonArrow}>
                                <Arrow />
                            </div>
                        </Button>
                    </Form>
                </div>
                <CmsBlock
                    identifiers="newsletterUnderText"
                    classes={{
                        root: ''
                    }}
                />
            </div>
        </div>
    );
};

Newsletter.propTypes = {
    classes: shape({
        modal_active: string,
        root: string,
        title: string,
        form: string,
        buttonsContainer: string
    })
};

export default Newsletter;
