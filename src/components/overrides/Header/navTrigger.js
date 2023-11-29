import { node, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { MenuIcon } from '@app/components/Icons';
import { useNavigationTrigger } from '@magento/peregrine/lib/talons/Header/useNavigationTrigger';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './navTrigger.module.css';

/**
 * A component that toggles the navigation menu.
 */
const NavigationTrigger = props => {
    const { formatMessage } = useIntl();
    const { handleOpenNavigation } = useNavigationTrigger();

    const classes = useStyle(defaultClasses, props.classes);
    return (
        <button
            className={classes.root}
            data-cy="Header-NavigationTrigger-root"
            aria-label={formatMessage({
                id: 'navigationTrigger.ariaLabel',
                defaultMessage: 'Toggle navigation panel'
            })}
            onClick={handleOpenNavigation}
        >
            <Icon src={MenuIcon} classes={{ root: classes.iconRoot, icon: '' }} />
        </button>
    );
};

NavigationTrigger.propTypes = {
    children: node,
    classes: shape({
        root: string
    })
};

export default NavigationTrigger;
