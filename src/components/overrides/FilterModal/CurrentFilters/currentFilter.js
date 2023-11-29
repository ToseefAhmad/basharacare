import { shape, string, func } from 'prop-types';
import React, { useCallback } from 'react';
import { X as Remove } from 'react-feather';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Trigger from '@magento/venia-ui/lib/components/Trigger';

import defaultClasses from './currentFilter.module.css';

const CurrentFilter = ({ group, item, removeItem, onRemove, ...props }) => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const handleClick = useCallback(() => {
        removeItem({ group, item });
        if (typeof onRemove === 'function') {
            onRemove(group, item);
        }
    }, [group, item, removeItem, onRemove]);

    const ariaLabel = formatMessage(
        {
            id: 'filterModal.action.clearFilterItem.ariaLabel',
            defaultMessage: 'Clear filter "{name}"'
        },
        {
            name: item.title
        }
    );

    return (
        <span className={classes.root} data-cy="CurrentFilter-root">
            <span className={classes.text}>{item.title}</span>
            <Trigger action={handleClick} ariaLabel={ariaLabel} data-cy="CurrentFilter-trigger">
                <Icon classes={{ icon: classes.removeIconClass }} size={15} src={Remove} />
            </Trigger>
        </span>
    );
};

export default CurrentFilter;

CurrentFilter.defaultProps = {
    onRemove: null
};

CurrentFilter.propTypes = {
    classes: shape({
        root: string
    }),
    onRemove: func
};
