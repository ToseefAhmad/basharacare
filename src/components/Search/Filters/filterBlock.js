import { Form } from 'informed';
import { array, func, string } from 'prop-types';
import React, { useState } from 'react';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import { connectRefinementList } from 'react-instantsearch-dom';

import Checkbox from '@app/components/overrides/Checkbox';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './filterBlock.module.css';

const FilterBlock = ({ items, refine, label }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const iconSrc = isExpanded ? ArrowUp : ArrowDown;

    if (!items.length) {
        return null;
    }

    return (
        <div className={classes.root}>
            <button
                className={classes.trigger}
                onClick={() => setIsExpanded(expanded => !expanded)}
                type="button"
                aria-expanded={isExpanded}
            >
                <span className={classes.header}>
                    <span className={classes.name}>{label}</span>
                    <Icon src={iconSrc} />
                </span>
            </button>
            {isExpanded ? (
                <Form className={classes.list}>
                    {items
                        .sort((a, b) => (a.label > b.label ? 1 : -1))
                        .map(item => (
                            <div key={item.label} className={classes.item}>
                                <Checkbox
                                    field={item.label}
                                    label={`${item.label} (${item.count})`}
                                    onClick={() => refine(item.value)}
                                    fieldValue={item.isRefined}
                                />
                            </div>
                        ))}
                </Form>
            ) : null}
        </div>
    );
};

FilterBlock.propTypes = {
    items: array,
    refine: func,
    label: string
};

export default connectRefinementList(FilterBlock);
