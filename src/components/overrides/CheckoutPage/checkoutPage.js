import AutoSubmitForm from '@magebit/pwa-studio-payfortFortCc/src/components/AutoSubmitForm';
import { shape, string } from 'prop-types';
import React, { Fragment, useCallback, useContext, useEffect, useRef, useState } from 'react';
import { AlertCircle as AlertCircleIcon } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { useFreeSamples } from '@app/components/FreeSamples/useFreeSamples';
import Button from '@app/components/overrides/Button';
import ItemsReview from '@app/components/overrides/CheckoutPage/ItemsReview/itemsReview';
import logo from '@app/components/overrides/Logo/logo.svg';
import RewardCodeProvider from '@app/components/RewardsAccount/RewardCode/context';
import { useScrollIntoView } from '@magento/peregrine/lib/hooks/useScrollIntoView';
import { CHECKOUT_STEP } from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';
import { useToasts } from '@magento/peregrine/lib/Toasts/useToasts';
import { useStyle } from '@magento/venia-ui/lib/classify';
import PaymentInformation from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation';
import payments from '@magento/venia-ui/lib/components/CheckoutPage/PaymentInformation/paymentMethodCollection';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import ScrollAnchor from '@magento/venia-ui/lib/components/ScrollAnchor/scrollAnchor';
import StockStatusMessage from '@magento/venia-ui/lib/components/StockStatusMessage';

import AddressBook from './AddressBook';
import defaultClasses from './checkoutPage.module.css';
import GuestSignIn from './GuestSignIn';
import OrderConfirmationPage from './OrderConfirmationPage';
import ShippingInformation from './ShippingInformation';
import ShippingMethod from './ShippingMethod';
import { useCheckoutPage } from './useCheckoutPage';
import { useGuestLoginToast } from './useGuestLoginToast';

const OrderSummary = React.lazy(() => import('@app/components/overrides/CheckoutPage/OrderSummary'));

const errorIcon = <Icon src={AlertCircleIcon} size={20} />;

const CheckoutPage = props => {
    const { classes: propClasses } = props;
    const { formatMessage } = useIntl();
    const {
        /**
         * Enum, one of:
         * SHIPPING_ADDRESS, SHIPPING_METHOD, PAYMENT, REVIEW
         */
        activeContent,
        availablePaymentMethods,
        cartItems,
        checkoutStep,
        customer,
        error,
        guestSignInUsername,
        handlePlaceOrder,
        hasError,
        isCartEmpty,
        isGuestCheckout,
        isLoading,
        isUpdating,
        isRedirecting,
        isDeliveryDateAvailable,
        orderDetailsData,
        deliveryDetailsData,
        orderNumber,
        orderDetailsLoading,
        placeOrderLoading,
        setCheckoutStep,
        setGuestSignInUsername,
        setIsUpdating,
        setShippingInformationDone,
        scrollShippingInformationIntoView,
        setShippingMethodDone,
        scrollShippingMethodIntoView,
        setPaymentInformationDone,
        shippingInformationRef,
        shippingMethodRef,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        toggleAddressBookContent,
        toggleSignInContent,
        cartData,
        scrollIntoView,
        anchorRef,
        setDoneEditingTheForm
    } = useCheckoutPage();

    const signIn = useRef(null);
    const [shouldScrollToSignIn, setShouldScrollToSignIn] = useState(false);
    const [shouldForceRefresh, setShouldForceRefresh] = useState(false);
    const { isOnlySampleProductInCart } = useFreeSamples();

    useEffect(() => {
        document.body.classList.add('checkout-page');
        return () => globalThis.document.body.classList.remove('checkout-page');
    }, []);

    const [showSignin, setShowSignin] = useState(false);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();
    const [, { addToast }] = useToasts();

    // Controls Sign In toast scroll
    const handleShowSignIn = useCallback(
        value => {
            setShowSignin(value);
            setShouldScrollToSignIn(value);
        },
        [setShouldScrollToSignIn, setShowSignin]
    );
    useScrollIntoView(signIn, shouldScrollToSignIn);

    const { setShowSignInToast } = useGuestLoginToast({ setGuestSignInUsername, setShowSignin: handleShowSignIn });

    useEffect(() => {
        if (hasError) {
            const message =
                error && error.message
                    ? error.message
                    : formatMessage({
                          id: 'checkoutPage.errorSubmit',
                          defaultMessage: 'Oops! An error occurred while submitting. Please try again.'
                      });
            addToast({
                type: 'error',
                icon: errorIcon,
                message,
                dismissable: true,
                timeout: 7000
            });

            if (process.env.NODE_ENV !== 'production') {
                console.error(error);
            }
        }
    }, [addToast, error, formatMessage, hasError]);

    const classes = useStyle(defaultClasses, propClasses);

    let checkoutContent;

    const heading = isGuestCheckout
        ? formatMessage({
              id: 'checkoutPage.guestCheckout',
              defaultMessage: 'Guest Checkout'
          })
        : formatMessage({
              id: 'checkoutPage.checkout',
              defaultMessage: 'Checkout'
          });

    const handleShowSignin = () => {
        setShowSignin(prevState => !prevState);
    };

    const signInElement = isGuestCheckout ? (
        <GuestSignIn
            key={guestSignInUsername}
            isActive={true}
            toggleActiveContent={toggleSignInContent}
            initialValues={{ email: guestSignInUsername }}
            handleShowSignin={handleShowSignin}
        />
    ) : null;

    if (orderNumber && orderDetailsData && (!isDeliveryDateAvailable || deliveryDetailsData) && !isRedirecting) {
        if (cartData && cartData.actionUrl) {
            return <AutoSubmitForm {...cartData} />;
        } else {
            return <OrderConfirmationPage data={orderDetailsData} orderNumber={orderNumber} />;
        }
    } else if (isLoading || isRedirecting) {
        return fullPageLoadingIndicator;
    } else if (isCartEmpty || isOnlySampleProductInCart) {
        checkoutContent = (
            <div className={classes.empty_cart_container}>
                <div style={{ visibility: 'hidden' }}>
                    <div className={classes.heading_container}>
                        <h1 className={classes.heading} data-cy="ChekoutPage-heading">
                            {heading}
                        </h1>
                    </div>
                </div>
                <h3>
                    <FormattedMessage
                        id="checkoutPage.emptyMessage"
                        defaultMessage="There are no items in your cart."
                    />
                </h3>
            </div>
        );
    } else {
        const signInContainerElement = isGuestCheckout ? (
            <div ref={signIn} className={classes.signInContainer}>
                {showSignin ? (
                    signInElement
                ) : (
                    <>
                        <span className={classes.signInLabel}>
                            <FormattedMessage
                                id="checkoutPage.signInLabel"
                                defaultMessage="Sign in for Express Checkout"
                            />
                        </span>
                        <Button
                            className={classes.signInButton}
                            data-cy="CheckoutPage-signInButton"
                            onClick={handleShowSignin}
                            priority="normal"
                        >
                            <FormattedMessage id="checkoutPage.signInButton" defaultMessage="Sign In" />
                        </Button>
                    </>
                )}
            </div>
        ) : null;

        const shippingMethodSection =
            checkoutStep >= CHECKOUT_STEP.SHIPPING_METHOD ? (
                <ShippingMethod
                    pageIsUpdating={isUpdating}
                    onSave={setShippingMethodDone}
                    onSuccess={scrollShippingMethodIntoView}
                    setPageIsUpdating={setIsUpdating}
                />
            ) : (
                <h3 className={classes.shipping_method_heading}>
                    <FormattedMessage id="checkoutPage.shippingMethodStep" defaultMessage="2. Shipping Method" />
                </h3>
            );

        const formErrors = [];
        const paymentMethods = Object.keys(payments);

        // If we have an implementation, or if this is a "zero" checkout,
        // We can allow checkout to proceed.
        const isPaymentAvailable = !!availablePaymentMethods.find(
            ({ code }) => code === 'free' || paymentMethods.includes(code)
        );

        if (!isPaymentAvailable) {
            formErrors.push(
                new Error(
                    formatMessage({
                        id: 'checkoutPage.noPaymentAvailable',
                        defaultMessage: 'Payment is currently unavailable.'
                    })
                )
            );
        }

        const paymentInformationSection =
            checkoutStep >= CHECKOUT_STEP.PAYMENT ? (
                <PaymentInformation
                    onSave={setPaymentInformationDone}
                    checkoutError={error}
                    resetShouldSubmit={resetReviewOrderButtonClicked}
                    setCheckoutStep={setCheckoutStep}
                    shouldSubmit={reviewOrderButtonClicked}
                    setSelectedPaymentMethod={setSelectedPaymentMethod}
                    selectedPaymentMethod={selectedPaymentMethod}
                    scrollIntoView={scrollIntoView}
                    handleReviewOrder={handleReviewOrder}
                    shouldForceRefresh={shouldForceRefresh}
                    setShouldForceRefresh={setShouldForceRefresh}
                    reviewOrderBtnDisabled={
                        !selectedPaymentMethod || !isPaymentAvailable || reviewOrderButtonClicked || isUpdating
                    }
                    anchorRef={anchorRef}
                />
            ) : (
                <h3 className={classes.payment_information_heading}>
                    <FormattedMessage
                        id="checkoutPage.paymentInformationStep"
                        defaultMessage="3. Payment Information"
                    />
                </h3>
            );
        const reviewOrderButton =
            checkoutStep === CHECKOUT_STEP.PAYMENT ? (
                <Button
                    onClick={handleReviewOrder}
                    priority="high"
                    className={classes.review_order_button}
                    data-cy="CheckoutPage-reviewOrderButton"
                    disabled={!selectedPaymentMethod || !isPaymentAvailable || reviewOrderButtonClicked || isUpdating}
                >
                    <FormattedMessage id="checkoutPage.reviewOrder" defaultMessage="Review Order" />
                </Button>
            ) : null;

        const placeOrderButton =
            checkoutStep === CHECKOUT_STEP.REVIEW ? (
                <Button
                    onClick={handlePlaceOrder}
                    priority="high"
                    className={classes.place_order_button}
                    data-cy="CheckoutPage-placeOrderButton"
                    disabled={isUpdating || placeOrderLoading || orderDetailsLoading}
                >
                    <FormattedMessage id="checkoutPage.placeOrder" defaultMessage="Place Order" />
                </Button>
            ) : null;

        const itemsReview =
            checkoutStep === CHECKOUT_STEP.REVIEW ? (
                <div className={classes.items_review_container}>
                    <ItemsReview checkoutStep={checkoutStep} anchorRef={anchorRef} scrollIntoView={scrollIntoView} />
                </div>
            ) : null;

        const orderSummary =
            cartItems && !isCartEmpty ? (
                <div className={classes.summaryContainer}>
                    <OrderSummary items={cartItems} setIsUpdating={setIsUpdating} isUpdating={isUpdating}>
                        <div>
                            {reviewOrderButton} {placeOrderButton}
                        </div>
                    </OrderSummary>
                </div>
            ) : null;

        let headerText;

        if (isGuestCheckout) {
            headerText = formatMessage({
                id: 'checkoutPage.guestCheckout',
                defaultMessage: 'Guest Checkout'
            });
        } else if (customer.default_shipping) {
            headerText = formatMessage({
                id: 'checkoutPage.reviewAndPlaceOrder',
                defaultMessage: 'Review and Place Order'
            });
        } else {
            headerText = formatMessage(
                {
                    id: 'checkoutPage.greeting',
                    defaultMessage: 'Welcome {firstname}!'
                },
                { firstname: customer.firstname }
            );
        }

        const checkoutContentClass =
            activeContent === 'checkout' ? classes.checkoutContent : classes.checkoutContent_hidden;

        const stockStatusMessageElement = (
            <Fragment>
                <FormattedMessage
                    id="checkoutPage.stockStatusMessage"
                    defaultMessage="An item in your cart is currently out-of-stock and must be removed in order to Checkout. Please return to your cart to remove the item."
                />
                <Link className={classes.cartLink} to="/cart">
                    <FormattedMessage id="checkoutPage.returnToCart" defaultMessage="Return to Cart" />
                </Link>
            </Fragment>
        );
        checkoutContent = (
            <div className={checkoutContentClass}>
                <div className={classes.formColumn}>
                    <h1 className={classes.heading} data-cy="ChekoutPage-heading">
                        <FormattedMessage id="checkoutPage.titleCheckout" defaultMessage="Checkout" />
                    </h1>
                    {signInContainerElement}
                    <div className={classes.heading_container}>
                        <FormError
                            classes={{
                                root: classes.formErrors
                            }}
                            errors={formErrors}
                        />
                        <StockStatusMessage cartItems={cartItems} message={stockStatusMessageElement} />
                        <h3 className={classes.heading} data-cy="ChekoutPage-headerText">
                            {headerText}
                        </h3>
                    </div>

                    <div className={classes.shipping_information_container}>
                        <ScrollAnchor ref={shippingInformationRef}>
                            <ShippingInformation
                                onSave={setShippingInformationDone}
                                onSuccess={scrollShippingMethodIntoView}
                                toggleActiveContent={toggleAddressBookContent}
                                toggleSignInContent={toggleSignInContent}
                                setGuestSignInUsername={setGuestSignInUsername}
                                setShowSignInToast={setShowSignInToast}
                                setShowSignin={handleShowSignIn}
                                setDoneEditingTheForm={setDoneEditingTheForm}
                            />
                        </ScrollAnchor>
                    </div>
                    <div className={classes.shipping_method_container}>
                        <ScrollAnchor ref={shippingMethodRef}>{shippingMethodSection}</ScrollAnchor>
                    </div>
                    <div className={classes.payment_information_container}>{paymentInformationSection}</div>
                </div>
                {orderSummary}
                {itemsReview}
            </div>
        );
    }

    const addressBookElement = !isGuestCheckout ? (
        <AddressBook
            activeContent={activeContent}
            toggleActiveContent={toggleAddressBookContent}
            onSuccess={() => {
                scrollShippingInformationIntoView();
                setShouldForceRefresh(true);
            }}
        />
    ) : null;

    return (
        <div className={classes.root} data-cy="CheckoutPage-root">
            <div className={classes.topBar}>
                <Link to="/" className={classes.logoContainer}>
                    <img className={classes.logo} src={logo} alt="logo" />
                </Link>
            </div>

            <StoreTitle>
                {formatMessage({
                    id: 'checkoutPage.titleCheckout',
                    defaultMessage: 'Checkout'
                })}
            </StoreTitle>
            <RewardCodeProvider setIsCartUpdating={setIsUpdating}>{checkoutContent}</RewardCodeProvider>
            {addressBookElement}
            <div ref={anchorRef} />
        </div>
    );
};

export default CheckoutPage;

export const usePaymentContext = () => useContext(PaymentContext);

CheckoutPage.propTypes = {
    classes: shape({
        root: string,
        checkoutContent: string,
        checkoutContent_hidden: string,
        heading_container: string,
        heading: string,
        cartLink: string,
        stepper_heading: string,
        shipping_method_heading: string,
        payment_information_heading: string,
        signInContainer: string,
        signInLabel: string,
        signInButton: string,
        empty_cart_container: string,
        shipping_information_container: string,
        shipping_method_container: string,
        payment_information_container: string,
        price_adjustments_container: string,
        items_review_container: string,
        summaryContainer: string,
        formErrors: string,
        review_order_button: string,
        place_order_button: string
    })
};
