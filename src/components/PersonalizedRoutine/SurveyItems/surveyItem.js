import React, { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '@app/components/overrides/Button';
import SimpleImage from '@app/components/overrides/Image/simpleImage';
import { useSurveyItem } from '@app/components/PersonalizedRoutine/SurveyItems/useSurveyItem';
import { useDropdown } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './surveyItem.module.css';

const SurveyItem = ({ entity_id, email, status, identifier, responses, updateHandle }) => {
    const classes = useStyle(defaultClasses);

    const storeSubmitted = responses[0] ? responses[0].answers?.created_at_store : '';
    const createdAt = responses[0] ? responses[0].answers?.created_at : '';
    const { elementRef, expanded, setExpanded } = useDropdown();
    const { handleStatusUpdate, getDate } = useSurveyItem({
        entity_id,
        updateHandle
    });

    const handleSortClick = useCallback(() => {
        setExpanded(!expanded);
    }, [setExpanded, expanded]);

    if (!responses || !responses.length) {
        return null;
    }

    const responsesElement = responses.map(({ title, answers }, index) => {
        const { text, other_answer, image, title: titleText } = answers;
        return (
            <div key={index}>
                <h5>
                    <span>{title}</span>
                </h5>
                {other_answer ? <p>{other_answer}</p> : null}
                {text ? <p>{text}</p> : null}
                {titleText ? <p>{titleText}</p> : null}
                {image ? <SimpleImage src={image} /> : null}
            </div>
        );
    });

    return (
        <li key={entity_id} ref={elementRef}>
            <div
                onClick={handleSortClick}
                onKeyDown={handleSortClick}
                role="button"
                tabIndex="0"
                className={classes.item}
            >
                <div className={classes.row}>
                    <span className={classes.itemValue}>{entity_id}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.itemValue}>{identifier}</span>
                </div>
                <div className={classes.row}>
                    <div className={classes.sharedEmail}>{email}</div>
                </div>
                <div className={classes.row}>
                    <span className={classes.storeValue}>{storeSubmitted}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.createdAt}>{getDate(createdAt)}</span>
                </div>
                <div className={classes.row}>
                    <span className={classes.itemValue}>
                        {status ? (
                            <FormattedMessage id="SurveyItems.messageReviewed" defaultMessage="Reviewed" />
                        ) : (
                            <FormattedMessage id="SurveyItems.messagePending" defaultMessage="Pending" />
                        )}
                    </span>
                </div>
            </div>
            {expanded ? (
                <div>
                    {responsesElement}
                    {!status ? (
                        <Button priority="high" onClick={handleStatusUpdate}>
                            <FormattedMessage id="SurveyItems.buttonReviewed" defaultMessage="Reviewed" />
                        </Button>
                    ) : null}
                </div>
            ) : null}
        </li>
    );
};

export default SurveyItem;
