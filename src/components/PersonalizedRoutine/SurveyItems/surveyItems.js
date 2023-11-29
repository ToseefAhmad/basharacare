import React, { useEffect } from 'react';

import Pagination from '@app/components/overrides/Pagination/pagination';
import { useStyle } from '@magento/venia-ui/lib/classify';

import SurveyItem from './surveyItem';
import defaultClasses from './surveyItems.module.css';

const SurveyItems = ({ items, pageControl, updateHandle, classes: propsClasses }) => {
    const classes = useStyle(defaultClasses, propsClasses);

    const itemsElement = items.map(({ entity_id, email, status, identifier, responses }) => (
        <SurveyItem
            entity_id={entity_id}
            email={email}
            status={status}
            identifier={identifier}
            key={entity_id}
            responses={responses}
            updateHandle={updateHandle}
        />
    ));

    useEffect(() => {
        scrollTo(0, 0);
    }, [items]);

    return items.length ? (
        <div>
            <ul className={classes.items}>{itemsElement}</ul>
            <Pagination pageControl={pageControl} />
        </div>
    ) : null;
};

export default SurveyItems;
