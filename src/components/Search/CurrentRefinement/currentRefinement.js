import { array, func } from 'prop-types';
import React, { useCallback } from 'react';
import { connectCurrentRefinements } from 'react-instantsearch-dom';
import { FormattedMessage } from 'react-intl';

import CurrentFilter from '@app/components/overrides/FilterModal/CurrentFilters/currentFilter';

import classes from './currentRefinement.module.css';

const CurrentRefinement = ({ items, refine }) => {
    const handleClearAll = useCallback(() => {
        refine(items);
    }, [items, refine]);

    const showClearAll = !!items.some(item => item.items && item.items.length);
    return (
        <div className={classes.root}>
            {items.map(attribute => {
                if (attribute.items) {
                    return attribute.items.map(item => (
                        <div key={item.label} className={classes.item}>
                            <CurrentFilter
                                key={item.label}
                                group={attribute.attribute}
                                item={{
                                    title: item.label
                                }}
                                removeItem={() => refine(item.value)}
                            />
                        </div>
                    ));
                } else if (attribute.currentRefinement) {
                    const title =
                        typeof attribute.currentRefinement === 'object' && attribute.currentRefinement.max
                            ? `${attribute.currentRefinement.min} - ${attribute.currentRefinement.max}`
                            : attribute.currentRefinement;
                    return (
                        <div key={attribute.attribute} className={classes.item}>
                            <CurrentFilter
                                key={attribute.attribute}
                                group={attribute.attribute}
                                item={{
                                    title
                                }}
                                removeItem={() => refine(attribute.value)}
                            />
                        </div>
                    );
                }
            })}
            {showClearAll && (
                <button className={classes.action} type="button" onClick={handleClearAll}>
                    <FormattedMessage id="filterModal.clearAll" defaultMessage="Clear filters" />
                </button>
            )}
        </div>
    );
};

CurrentRefinement.propTypes = {
    items: array,
    refine: func
};

export default connectCurrentRefinements(CurrentRefinement);
