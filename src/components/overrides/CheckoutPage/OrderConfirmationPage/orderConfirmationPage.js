import { object, shape, string } from 'prop-types';
import React, { useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';
import { Redirect } from 'react-router-dom/cjs/react-router-dom.min';

import ItemsReview from '../ItemsReview/itemsReview';

import Button from '@app/components/overrides/Button';
import CreateAccount from '@app/components/overrides/CheckoutPage/OrderConfirmationPage/createAccount';
import logo from '@app/components/overrides/Logo/logo.svg';
import { useOrderConfirmationPage } from '@magento/peregrine/lib/talons/CheckoutPage/OrderConfirmationPage/useOrderConfirmationPage';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

import ConfirmationSummary from './confirmationSummary';
import defaultClasses from './orderConfirmationPage.module.css';

const storage = new BrowserPersistence();

const getStorageData = () => {
    return storage.getItem('checkout_order_data');
};

const getOrderNumber = () => {
    return storage.getItem('checkout_order_number');
};

const OrderConfirmationPage = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { data, orderNumber, deliveryData } = props;
    const { formatMessage } = useIntl();

    let deliveryDateElement = null;
    if (deliveryData) {
        const { delivery_date, delivery_time, delivery_comment } = deliveryData?.getCartDeliveryInfo;

        deliveryDateElement = (
            <div className={classes.deliveryInfo}>
                <div>
                    <div className={classes.deliveryInfoLabel}>
                        <FormattedMessage id="shippingInfo.date" defaultMessage="Delivery date:" />
                    </div>
                    <div>{delivery_date}</div>
                </div>
                <div>
                    <div className={classes.deliveryInfoLabel}>
                        {' '}
                        <FormattedMessage id="shippingInfo.time" defaultMessage="Delivery time:" />
                    </div>
                    <div>{delivery_time}</div>
                </div>
                <div>
                    <div className={classes.deliveryInfoLabel}>
                        {' '}
                        <FormattedMessage id="shippingInfo.comment" defaultMessage="Delivery comment:" />
                    </div>
                    <div>{delivery_comment}</div>
                </div>
            </div>
        );
    }

    const orderData = data || getStorageData();

    const { flatData, isSignedIn } = useOrderConfirmationPage({
        data: orderData,
        orderNumber: orderNumber || getOrderNumber()
    });

    useEffect(() => {
        const { scrollTo } = globalThis;

        if (typeof scrollTo === 'function') {
            scrollTo({
                left: 0,
                top: 0,
                behavior: 'smooth'
            });
        }
    }, [props]);

    if (!flatData) {
        return <Redirect to="/" />;
    }

    const { city, country, email, firstname, lastname, shippingMethod, street } = flatData;

    const streetRows = street.map((row, index) => {
        return (
            <span key={index} className={classes.addressStreet}>
                {row}
            </span>
        );
    });

    const earnedPoints = orderData.cart.applied_rewards.earn_points;

    const earnedPointsSummary = isSignedIn ? (
        <div>
            <div>
                <FormattedMessage
                    id="checkoutPage.earnPoints"
                    defaultMessage="You earned {earnedPoints} reward points for this order"
                    values={{ earnedPoints }}
                />
            </div>
            <div>
                <FormattedMessage
                    id="checkoutPage.earnPointsEnrolled"
                    defaultMessage="Earned points will be enrolled to your account after we finish processing your order"
                />
            </div>
        </div>
    ) : null;

    const createAccountForm = !isSignedIn ? (
        <CreateAccount firstname={firstname} lastname={lastname} email={email} />
    ) : null;

    const nameString = `${firstname} ${lastname}`;
    const additionalAddressString = `${city}, ${country}`;

    return (
        <div className={classes.root} data-cy="OrderConfirmationPage-root">
            <div className={classes.topBar}>
                <Link to="/" className={classes.logoContainer}>
                    <img className={classes.logo} src={logo} alt="logo" />
                </Link>
            </div>
            <StoreTitle>
                {formatMessage({
                    id: 'checkoutPage.titleReceipt',
                    defaultMessage: 'Receipt'
                })}
            </StoreTitle>

            <div className={classes.mainContainer}>
                <h2 data-cy="OrderConfirmationPage-header" className={classes.heading}>
                    <FormattedMessage id="checkoutPage.thankYou" defaultMessage="Thank you for your order!" />
                </h2>
                <div className={classes.orderSucessText}>
                    <FormattedMessage id="checkoutPage.success" defaultMessage="Your Order is successfully placed" />
                </div>
                <div data-cy="OrderConfirmationPage-orderNumber" className={classes.orderNumber}>
                    <FormattedMessage
                        id="checkoutPage.orderNumber"
                        defaultMessage="Order Number: {orderNumber}"
                        values={{ orderNumber: orderNumber || getOrderNumber() }}
                    />
                </div>
                {earnedPointsSummary}
                <div className={classes.additionalText}>
                    <FormattedMessage
                        id="checkoutPage.additionalText"
                        defaultMessage="You will also receive an email with the details and we will let you know when your order has shipped."
                    />
                </div>

                <div className={classes.orderInfoContainer}>
                    <div>
                        <div className={classes.shippingInfoHeading}>
                            <FormattedMessage id="global.shippingInformation" defaultMessage="Shipping Information" />
                        </div>
                        <div className={classes.shippingInfo}>
                            <span className={classes.email}>{email}</span>
                            <span className={classes.name}>{nameString}</span>
                            {streetRows}
                            <span className={classes.addressAdditional}>{additionalAddressString}</span>
                        </div>
                    </div>
                    <div>
                        <div className={classes.shippingMethodHeading}>
                            <FormattedMessage id="global.shippingMethod" defaultMessage="Shipping Method" />
                        </div>
                        <div className={classes.shippingMethod}>{shippingMethod}</div>
                    </div>
                    {deliveryDateElement}
                </div>
                <div className={classes.summaryContainer}>
                    <ConfirmationSummary data={orderData} />
                </div>
                <div className={classes.itemsReview}>
                    <ItemsReview data={orderData} />
                </div>

                <form action="/">
                    <Button
                        classes={{ root_highPriority: classes.continueButton }}
                        priority="high"
                        type="submit"
                        value="continue shopping"
                    >
                        continue shopping
                    </Button>
                </form>
            </div>

            <div className={classes.sidebarContainer}>{createAccountForm}</div>
        </div>
    );
};

export default OrderConfirmationPage;

OrderConfirmationPage.propTypes = {
    classes: shape({
        addressStreet: string,
        mainContainer: string,
        heading: string,
        orderNumber: string,
        shippingInfoHeading: string,
        shippingInfo: string,
        email: string,
        name: string,
        addressAdditional: string,
        shippingMethodHeading: string,
        shippingMethod: string,
        itemsReview: string,
        additionalText: string,
        sidebarContainer: string
    }),
    data: object,
    orderNumber: string
};
