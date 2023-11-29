import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import classes from '../surveyPage.module.css';

import { LeftArrow } from '@app/components/Icons';
import { useScreenSize } from '@app/hooks/useScreenSize';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';

import Answers from './answers';

const Question = ({
    index,
    id,
    activeTab,
    title,
    description,
    type,
    isRequired,
    maxAnswers,
    hasOtherField,
    answers,
    handlePreviousTab,
    handleNextTab,
    total
}) => {
    const { isMobileScreen } = useScreenSize();
    const [isNextStepDisabled, setIsNextStepDisabled] = useState(!!isRequired);

    const setNextStepDisabled = () => {
        setIsNextStepDisabled(true);
    };
    const setNextStepEnabled = () => {
        setIsNextStepDisabled(false);
    };

    return (
        <div className={activeTab !== index ? classes.hidden : ''} role="tabpanel" id="tabpanel">
            <div className={classes.contentContainer}>
                <div className={classes.counter}>
                    <span>{index + 1}</span>
                    <span> / </span>
                    <span>{total + 2}</span>
                </div>
                <h4 className={classes.tabTitle}>{title}</h4>
                <p className={classes.description}>{description}</p>
            </div>
            <div className={classes.answersContainer}>
                <Answers
                    questionId={id}
                    answers={answers}
                    type={type}
                    isRequired={isRequired}
                    maxAnswers={maxAnswers}
                    hasOtherField={hasOtherField}
                    setNextStepDisabled={setNextStepDisabled}
                    setNextStepEnabled={setNextStepEnabled}
                />
            </div>
            <div className={classes.actionContainer}>
                <Button
                    priority="high"
                    type="button"
                    classes={{ root_highPriority: classes.nextAction }}
                    onClick={() => handleNextTab()}
                    disabled={isNextStepDisabled}
                >
                    <FormattedMessage id="question.nextButton" defaultMessage="Next" />
                </Button>
                <button type="button" className={classes.backAction} onClick={() => handlePreviousTab()}>
                    {!isMobileScreen && <Icon classes={{ root: classes.reset }} src={LeftArrow} />}
                    <span>
                        <FormattedMessage id="question.backButton" defaultMessage="Back" />
                    </span>
                </button>
            </div>
        </div>
    );
};

export default Question;
