import { Form } from 'informed';
import React, { useMemo } from 'react';
import { ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import QuestionRow from '@app/components/AmastyFaqQuestions/questionsRow';
import { useAmastyFaqQuestions } from '@app/components/AmastyFaqQuestions/useAmastyFaqQuestions';
import Button from '@app/components/overrides/Button';
import TextInput from '@app/components/overrides/TextInput';
import { isEmail } from '@app/util/formValidator';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import Field from '@magento/venia-ui/lib/components/Field';
import Icon from '@magento/venia-ui/lib/components/Icon';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import combine from '@magento/venia-ui/lib/util/combineValidators';
import { isRequired } from '@magento/venia-ui/lib/util/formValidators';

import classes from './amastyFaqQuestions.module.css';

const AmastyFaqQuestions = ({ productId, productUrlKey }) => {
    const { formatMessage } = useIntl();
    const {
        handleFormSubmit,
        submitLoading,
        setFormApi,
        isOpen,
        handleContentToggle,
        faqQuestionsData,
        handleChange
    } = useAmastyFaqQuestions({
        productId,
        productUrlKey
    });

    const questionRows = useMemo(() => {
        return faqQuestionsData.map((question, index) => {
            return <QuestionRow key={index} question={question} handleContentToggle={handleContentToggle} />;
        });
    }, [faqQuestionsData, handleContentToggle]);

    const contentClass = isOpen ? classes.content : classes.content_collapsed;

    const questionCount = faqQuestionsData?.length;
    return (
        <div className={classes.root}>
            <div className={classes.tabTitle} role="presentation" onClick={handleContentToggle}>
                <FormattedMessage
                    id="productFullDetail.tabs.faq"
                    defaultMessage="FAQ Questions ({questionCount})"
                    values={{ questionCount }}
                />
                <Icon src={isOpen ? ChevronDownIcon : ChevronUpIcon} size={30} />
            </div>
            <div className={contentClass}>
                <div>{questionRows}</div>
                <Form
                    getApi={setFormApi}
                    id="amasty-question-form"
                    onSubmit={handleFormSubmit}
                    className={classes.root}
                >
                    <div className={classes.textAreaContainer}>
                        <Field
                            id="title"
                            label={formatMessage({
                                id: 'productFullDetail.questionTitle',
                                defaultMessage: 'Ask a Question'
                            })}
                        >
                            <TextArea
                                id="question-field"
                                field="title"
                                placeholder={formatMessage({
                                    id: 'productFullDetail.questionPlaceholder',
                                    defaultMessage: 'Question'
                                })}
                                maxLength="500"
                                validate={isRequired}
                            />
                        </Field>
                        <Field
                            id="name"
                            label={formatMessage({
                                id: 'productFullDetail.questionName',
                                defaultMessage: 'Name'
                            })}
                        >
                            <TextInput field="name" />
                        </Field>
                        <Field
                            id="email"
                            label={formatMessage({
                                id: 'productFullDetail.questionEmail',
                                defaultMessage: 'Enter Your Email'
                            })}
                        >
                            <TextInput
                                autoComplete="email"
                                field="email"
                                id="email"
                                validate={combine([isRequired, isEmail])}
                            />
                        </Field>
                        <Field id="notification">
                            <Checkbox
                                field="notification"
                                onChange={handleChange}
                                label={formatMessage({
                                    id: 'productFullDetail.questionNotification',
                                    defaultMessage: 'Get notification on email when the answer is ready'
                                })}
                            />
                        </Field>
                    </div>

                    <Button disabled={submitLoading} type="submit">
                        <FormattedMessage id="productFullDetail.questionSubmit" defaultMessage="Add Question" />
                    </Button>
                </Form>
            </div>
        </div>
    );
};

export default AmastyFaqQuestions;
