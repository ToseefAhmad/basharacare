import React, { useCallback, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Accordion, Section } from '@app/components/overrides/Accordion';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';

import classes from './questionRow.module.css';

const QuestionRow = ({ question }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const handleContentToggle = useCallback(() => {
        setIsExpanded(isExpanded => !isExpanded);
    }, []);

    const contentClass = isExpanded ? classes.questionContent : classes.questionContent_collapsed;

    const maybeExpandButton = question?.answer ? (
        <div role="presentation" className={classes.fullAnswerButton} onClick={handleContentToggle}>
            <FormattedMessage id="question.expandText" defaultMessage="view more" />
        </div>
    ) : null;

    const sectionClasses = {
        root: classes.sectionRoot,
        title_wrapper: classes.sectionTitleWrapper,
        title: classes.answerTitle,
        contents_container: classes.sectionContents
    };

    const iconClasses = { root: classes.iconRoot };

    return (
        <Accordion noScrollIntoView classes={{ root: classes.accordionRoot }} canOpenMultiple={true}>
            <Section iconClasses={iconClasses} classes={sectionClasses} title={<b>{question?.title}</b>}>
                <div className={classes.shortAnswerContent} role="presentation">
                    {question?.short_answer}
                    {maybeExpandButton}
                </div>
                <div className={contentClass}>
                    <RichContent html={question?.answer} />
                </div>
            </Section>
        </Accordion>
    );
};

export default QuestionRow;
