import { bool, func, shape, string } from 'prop-types';
import React, { useCallback } from 'react';
import { Check } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon/icon';

import defaultClasses from './switcherItem.module.css';

const SwitcherItem = props => {
    const { active, onClick, option, children } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const handleClick = useCallback(() => {
        onClick(option);
    }, [option, onClick]);

    const activeIcon = active ? <Icon size={20} src={Check} /> : null;

    return (
        <button className={classes.root} disabled={active} onClick={handleClick}>
            <span className={classes.content}>
                <span className={classes.text}>{children}</span>
                {activeIcon}
            </span>
        </button>
    );
};

SwitcherItem.propTypes = {
    active: bool,
    classes: shape({
        content: string,
        root: string,
        text: string
    }),
    onClick: func,
    option: string
};

export default SwitcherItem;
