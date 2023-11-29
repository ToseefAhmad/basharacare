import React from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { Wishlist as WishlistIcon } from '@app/components/Icons';
import { useWishlistTrigger } from '@app/components/overrides/Header/useWishlistTrigger';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './wishlistTrigger.module.css';

const WhishlistTrigger = () => {
    const { formatMessage } = useIntl();

    const { itemCountDisplay } = useWishlistTrigger();

    const history = useHistory();

    const classes = useStyle(defaultClasses);

    const buttonAriaLabel = formatMessage({
        id: 'wishlistTrigger.ariaLabel',
        defaultMessage: 'Open wishlist'
    });

    const handleTriggerClick = () => {
        history.push('/wishlist');
    };

    const maybeItemCounter = itemCountDisplay ? (
        <span className={classes.counter} data-cy="CartTrigger-counter">
            {itemCountDisplay}
        </span>
    ) : null;

    return (
        <button className={classes.root} aria-label={buttonAriaLabel} onClick={handleTriggerClick}>
            <Icon src={WishlistIcon} classes={{ root: classes.iconRoot, icon: '' }} />
            {maybeItemCounter}
        </button>
    );
};

export default WhishlistTrigger;
