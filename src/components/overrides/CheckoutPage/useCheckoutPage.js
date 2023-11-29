import { useApolloClient, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState, useRef } from 'react';
import { useIntl } from 'react-intl';

import { useAppContext } from '@app/context/App';
import { useCheckoutContext } from '@app/context/Checkout';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useTracking } from '@app/hooks/useTracking';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user.js';
import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';
import CheckoutError from '@magento/peregrine/lib/talons/CheckoutPage/CheckoutError.js';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge.js';

import DEFAULT_OPERATIONS, { IS_DELIVERY_DATE_ACTIVE } from './checkoutPage.gql';

export const CHECKOUT_STEP = {
    SHIPPING_ADDRESS: 1,
    SHIPPING_METHOD: 2,
    PAYMENT: 3,
    REVIEW: 4
};

const storage = new BrowserPersistence();

/**
 *
 * @param {DocumentNode} props.operations.getCheckoutDetailsQuery query to fetch checkout details
 * @param {DocumentNode} props.operations.getCustomerQuery query to fetch customer details
 * @param {DocumentNode} props.operations.getOrderDetailsQuery query to fetch order details
 * @param {DocumentNode} props.operations.createCartMutation mutation to create a new cart
 * @param {DocumentNode} props.operations.placeOrderMutation mutation to place order
 *
 * @returns {
 *  activeContent: String,
 *  availablePaymentMethods: Array,
 *  cartItems: Array,
 *  checkoutStep: Number,
 *  customer: Object,
 *  error: ApolloError,
 *  handlePlaceOrder: Function,
 *  hasError: Boolean,
 *  isCartEmpty: Boolean,
 *  isGuestCheckout: Boolean,
 *  isLoading: Boolean,
 *  isUpdating: Boolean,
 *  orderDetailsData: Object,
 *  orderDetailsLoading: Boolean,
 *  orderNumber: String,
 *  placeOrderLoading: Boolean,
 *  setCheckoutStep: Function,
 *  setIsUpdating: Function,
 *  setShippingInformationDone: Function,
 *  setShippingMethodDone: Function,
 *  setPaymentInformationDone: Function,
 *  scrollShippingInformationIntoView: Function,
 *  shippingInformationRef: ReactRef,
 *  shippingMethodRef: ReactRef,
 *  scrollShippingMethodIntoView: Function,
 *  resetReviewOrderButtonClicked: Function,
 *  handleReviewOrder: Function,
 *  reviewOrderButtonClicked: Boolean,
 *  toggleAddressBookContent: Function,
 *  toggleSignInContent: Function,
 * }
 */
export const useCheckoutPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        createCartMutation,
        getCheckoutDetailsQuery,
        getCustomerQuery,
        getOrderDetailsQuery,
        getDeliveryDetailsQuery,
        placeOrderMutation
    } = operations;

    const [reviewOrderButtonClicked, setReviewOrderButtonClicked] = useState(false);
    const [{ apsFormData }] = useCheckoutContext();

    const { location } = globalThis;
    const shippingInformationRef = useRef();
    const shippingMethodRef = useRef();
    const anchorRef = useRef(null);
    const initialized = useRef(false);
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const apolloClient = useApolloClient();
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeContent, setActiveContent] = useState('checkout');
    const [isRedirecting, setIsRedirecting] = useState(false);
    const [checkoutStep, setCheckoutStep] = useState(CHECKOUT_STEP.SHIPPING_ADDRESS);
    const [guestSignInUsername, setGuestSignInUsername] = useState('');

    const [{ isSignedIn }] = useUserContext();
    const [{ isSigningIn }] = useAppContext();
    const [{ cartId }, { createCart, removeCart }] = useCartContext();
    const { trackOpenCheckout, getProductCategories, trackCheckoutStep } = useTracking();

    const [fetchCartId] = useMutation(createCartMutation);
    const [placeOrder, { data: placeOrderData, error: placeOrderError, loading: placeOrderLoading }] = useMutation(
        placeOrderMutation
    );

    useEffect(() => {
        const failedType = getSearchParam('paymentFailed', location);
        if (failedType) {
            switch (failedType.replace('/', '')) {
                case 'payfort':
                    addToast({
                        customId: 'checkoutPage.paymentFailed',
                        type: ToastType.ERROR,
                        message: formatMessage({
                            id: 'checkoutPage.payfortPaymentFailed',
                            defaultMessage:
                                'Your bank declined the transaction. Please check payment details or try again using a different payment method'
                        }),
                        timeout: false
                    });
                    break;
                default:
                    addToast({
                        customId: 'checkoutPage.paymentFailed',
                        type: ToastType.ERROR,
                        message: formatMessage({
                            id: 'checkoutPage.paymentFailed',
                            defaultMessage:
                                'Payment failed. Please check payment details or try again using a different payment method'
                        }),
                        timeout: false
                    });
            }
        }
    }, [addToast, formatMessage, location]);

    const [getOrderDetails, { data: orderDetailsData, loading: orderDetailsLoading }] = useLazyQuery(
        getOrderDetailsQuery,
        {
            // We use this query to fetch details _just_ before submission, so we
            // Want to make sure it is fresh. We also don't want to cache this data
            // Because it may contain PII.
            fetchPolicy: 'no-cache',
            skip: !cartId || isSigningIn,
            variables: {
                cartId
            }
        }
    );

    const { data: config } = useQuery(IS_DELIVERY_DATE_ACTIVE, {
        fetchPolicy: 'cache-first'
    });

    const [getDeliveryDetails, { data: deliveryDetailsData, loading: deliveryDetailsLoading }] = useLazyQuery(
        getDeliveryDetailsQuery,
        {
            fetchPolicy: 'no-cache',
            skip: !cartId,
            variables: {
                cartId
            }
        }
    );

    const { data: customerData, loading: customerLoading } = useQuery(getCustomerQuery, { skip: !isSignedIn });
    const { data: checkoutData, networkStatus: checkoutQueryNetworkStatus } = useQuery(getCheckoutDetailsQuery, {
        /**
         * Skip fetching checkout details if the `cartId`
         * is a falsy value.
         */
        skip: !cartId || isSigningIn,
        notifyOnNetworkStatusChange: true,
        variables: {
            cartId
        }
    });

    const isDeliveryDateAvailable = useMemo(() => {
        return config?.storeConfig?.delivery_date_active === '1';
    }, [config]);

    const cartItems = useMemo(() => {
        return (checkoutData && checkoutData?.cart?.items) || [];
    }, [checkoutData]);

    /**
     * For more info about network statues check this out
     *
     * https://www.apollographql.com/docs/react/data/queries/#inspecting-loading-states
     */
    const isLoading = useMemo(() => {
        const checkoutQueryInFlight = checkoutQueryNetworkStatus ? checkoutQueryNetworkStatus < 7 : true;

        return checkoutQueryInFlight || customerLoading;
    }, [checkoutQueryNetworkStatus, customerLoading]);

    const customer = customerData && customerData.customer;

    const toggleAddressBookContent = useCallback(() => {
        setActiveContent(currentlyActive => (currentlyActive === 'checkout' ? 'addressBook' : 'checkout'));
    }, []);
    const toggleSignInContent = useCallback(() => {
        setActiveContent(currentlyActive => (currentlyActive === 'checkout' ? 'signIn' : 'checkout'));
    }, []);

    const checkoutError = useMemo(() => {
        if (placeOrderError) {
            return new CheckoutError(placeOrderError);
        }
    }, [placeOrderError]);

    const handleReviewOrder = useCallback(() => {
        setReviewOrderButtonClicked(true);
    }, []);

    const resetReviewOrderButtonClicked = useCallback(() => {
        setReviewOrderButtonClicked(false);
    }, []);

    const scrollShippingInformationIntoView = useCallback(() => {
        if (anchorRef.current) {
            anchorRef.current.scrollIntoView({
                behavior: 'smooth'
            });
        }
    }, [anchorRef]);

    const setShippingInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_ADDRESS) {
            trackCheckoutStep({
                stepNum: 'SHIPPING_ADDRESS',
                products: cartItems.map(item => ({
                    sku: item.product.sku,
                    name: item.product.name,
                    price: item.prices.price.value,
                    quantity: item.quantity,
                    category: getProductCategories(item.product.categories)
                }))
            });
            setCheckoutStep(CHECKOUT_STEP.SHIPPING_METHOD);
        }
    }, [cartItems, checkoutStep, getProductCategories, trackCheckoutStep]);

    const scrollShippingMethodIntoView = useCallback(() => {
        if (shippingMethodRef.current) {
            shippingMethodRef.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, [shippingMethodRef]);

    const setShippingMethodDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.SHIPPING_METHOD) {
            trackCheckoutStep({
                stepNum: 'SHIPPING_METHOD',
                products: cartItems.map(item => ({
                    sku: item.product.sku,
                    name: item.product.name,
                    price: item.prices.price.value,
                    quantity: item.quantity,
                    category: getProductCategories(item.product.categories)
                }))
            });
            setCheckoutStep(CHECKOUT_STEP.PAYMENT);
        }
    }, [cartItems, checkoutStep, getProductCategories, trackCheckoutStep]);

    const scrollIntoView = useCallback(ref => {
        if (ref.current) {
            ref.current.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }, []);

    const setPaymentInformationDone = useCallback(() => {
        if (checkoutStep === CHECKOUT_STEP.PAYMENT) {
            trackCheckoutStep({
                stepNum: 'PAYMENT',
                products: cartItems.map(item => ({
                    sku: item.product.sku,
                    name: item.product.name,
                    price: item.prices.price.value,
                    quantity: item.quantity,
                    category: getProductCategories(item.product.categories)
                }))
            });
            setCheckoutStep(CHECKOUT_STEP.REVIEW);
        }
    }, [cartItems, checkoutStep, getProductCategories, trackCheckoutStep]);

    const [isPlacingOrder, setIsPlacingOrder] = useState(false);

    const handlePlaceOrder = useCallback(async () => {
        // Fetch order details and then use an effect to actually place the
        // Order. If/when Apollo returns promises for invokers from useLazyQuery
        // We can just await this function and then perform the rest of order
        // Placement.
        await getOrderDetails({
            variables: {
                cartId
            }
        });
        if (isDeliveryDateAvailable) {
            await getDeliveryDetails({
                variables: {
                    cartId
                }
            });
        }

        trackCheckoutStep({
            stepNum: 'REVIEW',
            products: cartItems.map(item => ({
                sku: item.product.sku,
                name: item.product.name,
                price: item.prices.price.value,
                quantity: item.quantity,
                category: getProductCategories(item.product.categories)
            }))
        });

        setIsPlacingOrder(true);
    }, [
        getOrderDetails,
        cartId,
        isDeliveryDateAvailable,
        getDeliveryDetails,
        trackCheckoutStep,
        cartItems,
        getProductCategories
    ]);

    // Go back to checkout if shopper logs in
    useEffect(() => {
        if (isSignedIn) {
            setActiveContent('checkout');
        }
    }, [isSignedIn]);

    const [doneEditingTheForm, setDoneEditingTheForm] = useState(false);

    // After checkout page is reopened for signed-in users focusing on the shipping method
    // And for guest users checking if the form is filled and then focusing on the shipping method.
    useEffect(() => {
        if (isSignedIn || doneEditingTheForm) {
            scrollShippingMethodIntoView();
        }
    }, [doneEditingTheForm, isSignedIn, scrollShippingMethodIntoView]);

    // // After checkout page is reloaded doing the same as in last function.
    document.onreadystatechange = () => {
        if (isSignedIn || doneEditingTheForm) {
            setTimeout(() => {
                scrollShippingMethodIntoView();
            }, 1);
        }
    };

    useEffect(() => {
        const placeOrderAndCleanup = async () => {
            try {
                const result = await placeOrder({
                    variables: {
                        cartId
                    }
                });

                setIsRedirecting(!!result?.data?.placeOrder?.order?.redirect_url);
                // Cleanup stale cart and customer info.
                await removeCart();
                await apolloClient.clearCacheData(apolloClient, 'cart');

                await createCart({
                    fetchCartId
                });

                storage.setItem('checkout_order_data', orderDetailsData);
                storage.setItem('checkout_order_number', result?.data?.placeOrder?.order?.order_number);

                if (result?.data?.placeOrder?.order?.redirect_url) {
                    !!location && location.replace(result.data.placeOrder.order.redirect_url);
                }
            } catch (err) {
                console.error('An error occurred during when placing the order', err);
                setReviewOrderButtonClicked(false);
                setCheckoutStep(CHECKOUT_STEP.PAYMENT);
            }
        };

        if (orderDetailsData && isPlacingOrder) {
            setIsPlacingOrder(false);
            placeOrderAndCleanup();
        }
    }, [
        apolloClient,
        cartId,
        createCart,
        fetchCartId,
        orderDetailsData,
        placeOrder,
        removeCart,
        isPlacingOrder,
        placeOrderData,
        location
    ]);

    // Initialize checkout state
    useEffect(() => {
        if (!initialized.current && checkoutData && cartItems.length) {
            initialized.current = true;

            trackOpenCheckout({
                products: cartItems.map(item => ({
                    name: item.product.name,
                    sku: item.product.sku,
                    price: item.prices.price.value,
                    currency: item.prices.price.currency,
                    quantity: item.quantity,
                    category: getProductCategories(item.product.categories),
                    brand: item.product.brand_name
                }))
            });
        }
    }, [cartItems, trackOpenCheckout, checkoutData, getProductCategories]);

    const orderNumber = (placeOrderData && placeOrderData.placeOrder.order.order_number) || null;
    const cartData = {};

    if (placeOrderData?.placeOrder?.order?.payfort?.url) {
        const { url, params } = placeOrderData.placeOrder.order.payfort;

        storage.setItem('checkout_order_data', orderDetailsData);
        storage.setItem('checkout_order_number', orderNumber);

        const formParams = { ...params };
        delete formParams['__typename'];
        formParams.expiry_date = apsFormData?.yearDate + apsFormData?.monthDate;
        formParams.card_number = apsFormData?.number;
        formParams.card_holder_name = apsFormData?.holderName;
        formParams.card_security_code = apsFormData?.cvv;

        cartData['actionUrl'] = url;
        cartData['params'] = formParams;
    }

    return {
        activeContent,
        availablePaymentMethods: checkoutData?.cart?.available_payment_methods || null,
        cartItems,
        checkoutStep,
        customer,
        error: checkoutError,
        guestSignInUsername,
        handlePlaceOrder,
        hasError: !!checkoutError,
        isCartEmpty: !(checkoutData && checkoutData?.cart?.total_quantity),
        isGuestCheckout: !isSignedIn,
        isLoading,
        isUpdating,
        isRedirecting,
        orderDetailsData,
        deliveryDetailsData,
        isDeliveryDateAvailable,
        orderDetailsLoading: orderDetailsLoading || deliveryDetailsLoading,
        orderNumber,
        placeOrderLoading,
        setCheckoutStep,
        setGuestSignInUsername,
        setIsUpdating,
        setShippingInformationDone,
        setShippingMethodDone,
        setPaymentInformationDone,
        scrollShippingInformationIntoView,
        shippingInformationRef,
        shippingMethodRef,
        scrollShippingMethodIntoView,
        resetReviewOrderButtonClicked,
        handleReviewOrder,
        reviewOrderButtonClicked,
        toggleAddressBookContent,
        toggleSignInContent,
        cartData,
        scrollIntoView,
        anchorRef,
        setDoneEditingTheForm
    };
};
