import { bool, shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './quickfilterDefault.module.css';

const QuickfilterDefault = ({ classes: propsClasses, isSelected, item, ...restProps }) => {
    const { label } = item || {};

    const classes = useStyle(defaultClasses, propsClasses);

    const rootClass = isSelected ? classes.rootActive : classes.root;

    return (
        <span
            className={rootClass}
            {...restProps}
            onClick={restProps.onMouseDown}
            onKeyDown={restProps.onKeyDown}
            tabIndex={0}
            role="button"
        >
            {label}
        </span>
    );
};

export default QuickfilterDefault;

QuickfilterDefault.propTypes = {
    classes: shape({
        root: string,
        icon: string,
        label: string,
        checked: string
    }),
    group: string,
    isSelected: bool,
    item: shape({
        label: string.isRequired,
        value_index: string.isRequired
    }).isRequired,
    label: string
};
