import { shape, string } from 'prop-types';
import React, { Fragment, Suspense } from 'react';
import { useIntl } from 'react-intl';

import CartPopUp from '@app/components/CartPopUp';
import { Cart as ShoppingCartIcon, Rectangle } from '@app/components/Icons';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCartTrigger } from '@magento/peregrine/lib/talons/Header/useCartTrigger';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { GET_ITEM_COUNT_QUERY } from '@magento/venia-ui/lib/components/Header/cartTrigger.gql';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './cartTrigger.module.css';

const MiniCart = React.lazy(() => import('@magento/venia-ui/lib/components/MiniCart'));

const CartTrigger = props => {
    const {
        handleTriggerClick,
        itemCount,
        miniCartRef,
        miniCartIsOpen,
        hideCartTrigger,
        setMiniCartIsOpen,
        miniCartTriggerRef
    } = useCartTrigger({
        queries: {
            getItemCountQuery: GET_ITEM_COUNT_QUERY
        }
    });

    const [{ cartItem }] = useAppContext();

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const buttonAriaLabel = formatMessage(
        {
            id: 'cartTrigger.ariaLabel',
            defaultMessage: 'Toggle mini cart. You have {count} items in your cart.'
        },
        { count: itemCount }
    );
    const itemCountDisplay = itemCount > 99 ? '99+' : itemCount;
    const triggerClassName = miniCartIsOpen ? classes.triggerContainer_open : classes.triggerContainer;

    const maybeItemCounter = itemCount ? (
        <span className={classes.counter} data-cy="CartTrigger-counter">
            {itemCountDisplay}
        </span>
    ) : null;

    const indicator =
        miniCartIsOpen || cartItem ? (
            <Icon src={Rectangle} classes={{ root: classes.rectangleRoot, icon: '' }} />
        ) : null;

    const cartPopUp = cartItem && <CartPopUp data={cartItem} />;

    const cartTrigger = hideCartTrigger ? null : (
        /* Because this button behaves differently on desktop and mobile
        we render two buttons that differ only in their click handler
        and control which one displays via CSS. */
        <Fragment>
            <div className={triggerClassName} ref={miniCartTriggerRef}>
                <button
                    aria-label={buttonAriaLabel}
                    className={classes.trigger}
                    onClick={handleTriggerClick}
                    data-cy="CartTrigger-trigger"
                >
                    <Icon src={ShoppingCartIcon} classes={{ root: classes.iconRoot, icon: '' }} />
                    {maybeItemCounter}
                </button>
                <div className={classes.indicatorContainer}>{indicator}</div>
                {cartPopUp}
            </div>
            <Suspense fallback={null}>
                <MiniCart isOpen={miniCartIsOpen} setIsOpen={setMiniCartIsOpen} ref={miniCartRef} />
            </Suspense>
        </Fragment>
    );

    return cartTrigger;
};

export default CartTrigger;

CartTrigger.propTypes = {
    classes: shape({
        counter: string,
        link: string,
        openIndicator: string,
        root: string,
        trigger: string,
        triggerContainer: string
    })
};
