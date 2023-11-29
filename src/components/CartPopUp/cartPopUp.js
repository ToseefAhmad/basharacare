import PropTypes, { object } from 'prop-types';
import React, { useCallback, useEffect, useState } from 'react';
import { ChevronLeft } from 'react-feather';
import { FormattedMessage } from 'react-intl';
import { useHistory } from 'react-router-dom';

import Button from '@app/components/overrides/Button';
import LinkButton from '@app/components/overrides/LinkButton';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './cartPopUp.module.css';

const CartPopUp = ({ data }) => {
    const [hover, setHover] = useState(false);
    const classes = useStyle(defaultClasses);
    const { cartItem } = data;

    const history = useHistory();

    const [
        ,
        {
            actions: { setCartPopUp }
        }
    ] = useAppContext();

    const closePopUp = useCallback(() => setCartPopUp(null), [setCartPopUp]);

    const handleLinkClick = useCallback(() => {
        // Send the user to the cart page.
        history.push('/cart');
        closePopUp();
    }, [history, closePopUp]);

    const stopTimer = val => {
        setHover(val);
    };

    const finalPrice = cartItem?.price_range?.maximum_price?.final_price?.value;

    useEffect(() => {
        if (!hover) {
            document.addEventListener('mousedown', closePopUp);
            // CLosing pop up after 5sec.
            const timer = setTimeout(closePopUp, 5000);
            return () => {
                clearTimeout(timer);
                document.removeEventListener('mousedown', closePopUp);
            };
        }
    }, [hover, closePopUp]);

    return (
        <div className={classes.root} onMouseEnter={() => stopTimer(true)} onMouseLeave={() => stopTimer(false)}>
            <h3 className={classes.heading}>
                <FormattedMessage id="cartPopUp.addedToCart" defaultMessage="Just added to the cart" />
            </h3>
            <div className={classes.productContainer}>
                <Image
                    alt={cartItem.name}
                    classes={{
                        root: classes.thumbnail
                    }}
                    width={100}
                    resource={cartItem.small_image.url || cartItem.small_image}
                />
                <div className={classes.productDetailsContainer}>
                    <div className={classes.productName}>{cartItem.name}</div>
                    <div className={classes.productQuantity}>
                        <span>
                            <FormattedMessage id="cartPopUp.qty" defaultMessage="Qty: " />
                        </span>
                        {cartItem.quantity}
                    </div>
                    <div className={classes.price}>
                        <div>
                            <Price
                                value={finalPrice}
                                currencyCode={cartItem?.price_range?.maximum_price?.final_price?.currency}
                            />
                        </div>
                    </div>
                </div>
            </div>
            <div className={classes.buttonContainer}>
                <Button onClick={handleLinkClick} priority="high" classes={{ root_highPriority: classes.buttonRoot }}>
                    <FormattedMessage id="cartPopUp.checkout" defaultMessage="Checkout" />
                </Button>
                <div className={classes.linkContainer}>
                    <Icon
                        src={ChevronLeft}
                        attrs={{
                            width: 25
                        }}
                    />
                    <LinkButton classes={{ root: classes.link }} onClick={closePopUp}>
                        <FormattedMessage id="cartPopUp.continue" defaultMessage="Continue Shopping" />
                    </LinkButton>
                </div>
            </div>
        </div>
    );
};

CartPopUp.propTypes = {
    data: object,
    headerRef: PropTypes.any
};

export default CartPopUp;
