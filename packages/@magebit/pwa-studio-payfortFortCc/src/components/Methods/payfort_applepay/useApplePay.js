import { useApolloClient, useLazyQuery, useMutation, useQuery } from '@apollo/client';
import DEFAULT_OPERATIONS from '@magebit/pwa-studio-payfortFortCc/src/talons/payment.gql';
import { useState, useCallback, useEffect } from 'react';

import CHECKOUT_OPERATIONS from '@app/components/overrides/CheckoutPage/checkoutPage.gql';
import SHIPPING_OPERATIONS from '@app/components/overrides/CheckoutPage/ShippingMethod/shippingMethod.gql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';
import { ToastType, useToasts } from '@app/hooks/useToasts';

const requestData = {
    "countryCode": "AE",
    "currencyCode": "AED",
    "merchantCapabilities": [
        "supports3DS",
        "supportsDebit",
        "supportsCredit"
    ],
    "shippingMethods": [],
    "shippingType": "shipping",
    "supportedNetworks": [
        "visa",
        "masterCard",
        "mada",
        "discover"
    ],
    "requiredBillingContactFields": [
        "postalAddress",
        "name"
    ],
    "requiredShippingContactFields": [
        "postalAddress",
        "name",
        "phone",
        "email"
    ],
    "lineItems": [],
    "total": {}
};

const storage = new BrowserPersistence();

export const useApplePay = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, CHECKOUT_OPERATIONS, SHIPPING_OPERATIONS, props.operations);

    const {
        getPaymentConfigQuery,
        setPaymentMethodOnCartMutation,
        applePayPlaceOrderMutation,
        applePaySetShippingMutation,
        applePaySetShippingAddressMutation,
        applePaySetLoggerMutation,
        getOrderDetailsQuery,
        setShippingMethodMutation,
        createCartMutation
    } = operations;

    const apolloClient = useApolloClient();
    const [{ cartId }, { createCart, removeCart }] = useCartContext();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const [,{ addToast }] = useToasts();
    
    const {data: configData} = useQuery(getPaymentConfigQuery, {
        fetchPolicy: 'cache-first'
    });

    const [getOrderDetails, { data: orderDetailsData }] = useLazyQuery(getOrderDetailsQuery, {
        // We use this query to fetch details _just_ before submission, so we
        // Want to make sure it is fresh. We also don't want to cache this data
        // Because it may contain PII.
        fetchPolicy: 'no-cache',
        skip: !cartId,
        variables: {
            cartId
        }
    });

    const [setShippingMethodCall] = useMutation(setShippingMethodMutation);

    const [sendDebug] = useMutation(applePaySetLoggerMutation);

    const [placeOrder] = useMutation(applePayPlaceOrderMutation);

    const [setShipping, { loading: setShippingLoading }] = useMutation(applePaySetShippingMutation);
    const [setShippingAddress] = useMutation(applePaySetShippingAddressMutation);
    const [fetchCartId] = useMutation(createCartMutation);

    const { resetShouldSubmit, onPaymentSuccess, onPaymentError, setIsCartUpdating } = props;

    const [
        updatePaymentMethod,
        {
            error: paymentMethodMutationError,
            called: paymentMethodMutationCalled,
            loading: paymentMethodMutationLoading
        }
    ] = useMutation(setPaymentMethodOnCartMutation);

    const [session, setSession] = useState(null);
    const [appleAddress, setAppleAddress] = useState(null);
    const { flatData, isCheckout } = usePriceSummary();

    const debugLog = useCallback((options) => {
        if (configData?.storeConfig?.applepay_debug) {
            sendDebug(options);
        }
    }, [sendDebug, configData])

    const requestTotals = useCallback(
        async (address, callback) => {
            const rates = address.method ? address.method.split('_') : [];

            if (rates.length) {
                await setShippingMethodCall({
                    variables: {
                        cartId,
                        shippingMethod: {
                            carrier_code: rates[0],
                            method_code: rates[1]
                        }
                    }
                });
            }

            const totals = getDataFromTotals(flatData);

            callback({
                newLineItems: totals.lineItems,
                newTotal: totals.total
            });
        },
        [cartId, flatData, setShippingMethodCall]
    );

    const ucFirst = (str) => {
        if (!str) return str;

        return str[0].toUpperCase() + str.slice(1);
    };

    const getDataFromTotals = data => {
        const dataTotal = {
            currencyCode: data?.total?.currency,
            lineItems: []
        };

        dataTotal.lineItems = Object.keys(data).reduce((lineItems, code) => {
            if (code !== 'total' && data[code]) {
                if (code === 'taxes') {
                    lineItems.push({
                        label: ucFirst(code),
                        amount: data[code].reduce((val, item) => {
                            val += item?.amount?.value || 0;
                            return val;
                        }, 0)
                    });
                } else {
                    lineItems.push({
                        label: ucFirst(code),
                        amount: data[code].value || 0
                    });
                }
            }
            return lineItems;
        }, []);

        const { total } = data;

        dataTotal.total = {
            label: 'Grand Total',
            amount: total.value
        };

        return isCheckout ? Object.assign({
            "countryCode": "AE",
            "merchantCapabilities": [
                "supports3DS"
            ],
            "supportedNetworks": [
                "visa",
                "masterCard",
                "amex",
                "discover"
            ]
        }, dataTotal) : Object.assign(requestData, dataTotal);
    };

    useEffect(() => {
        if (orderDetailsData && isPlacingOrder && session && flatData) {
            session.onvalidatemerchant = async () => {
                fetch("/applepay/requestSession/index")
                    .then(res => res.json())
                    .then(merchantSession => {
                        session.completeMerchantValidation(merchantSession);
                    }).catch(validationErr => {
                    // You should show an error to the user, e.g. 'Apple Pay failed to load.'
                    debugLog({
                        variables: {
                            debug: 'Error validating merchant:' + validationErr
                        }
                    });
                    console.error('Error validating merchant:', validationErr);
                    session.abort();
                });
            };

            session.onpaymentmethodselected = async () => {
                const totalsData = getDataFromTotals(flatData);
                await debugLog({
                    variables: {
                        status: 'APPLE PAY',
                        message: 'Payment Method Selected',
                        debug: JSON.stringify(totalsData)
                    }
                });
                session.completePaymentMethodSelection({
                    newTotal: totalsData.total,
                    newLineItems: totalsData.lineItems
                });
            };

            session.onshippingmethodselected = async event => {
                const data = Object.assign(appleAddress, {method: event.shippingMethod.identifier});
                await debugLog({
                    variables: {
                        status: 'APPLE PAY',
                        message: 'Shipping Method Event',
                        debug: JSON.stringify(data)
                    }
                });
                requestTotals(data, totals => {
                    session.completeShippingMethodSelection(totals);
                }).then(result => {
                    debugLog({
                        variables: {
                            status: 'APPLE PAY',
                            message: 'Shipping Method Selected',
                            debug: JSON.stringify(result)
                        }
                    });
                }).catch(error => {
                    debugLog({
                        variables: {
                            status: 'APPLE PAY',
                            message: 'Shipping Method Selected ERROR',
                            debug: error
                        }
                    });
                });
            };

            session.onshippingcontactselected = async event => {
                let data = event.shippingContact;
                await debugLog({
                    variables: {
                        status: 'APPLE PAY',
                        message: 'Shipping Contact',
                        debug: JSON.stringify(data)
                    }
                });
                setAppleAddress(data);
                try {
                    const result = await setShipping({
                        variables: {
                            cartId,
                            address: JSON.stringify(data)
                        }
                    });
                    await debugLog({
                        variables: {
                            status: 'APPLE PAY',
                            message: 'Default Shipping Method Result',
                            debug: JSON.stringify(result)
                        }
                    });

                    if (result?.data?.applePaySetShipping?.newShippingMethods) {
                        const defaultShippingMethod = result?.data?.applePaySetShipping?.newShippingMethods[0];
                        data = Object.assign(data, {
                            method: defaultShippingMethod.identifier
                        });
                        await debugLog({
                            variables: {
                                status: 'APPLE PAY',
                                message: 'Default Shipping Method',
                                debug: JSON.stringify(data)
                            }
                        });
                    }

                    setIsCartUpdating(setShippingLoading);

                    await requestTotals(data, function(totals) {
                        session.completeShippingContactSelection(
                            Object.assign(result?.data?.applePaySetShipping, totals)
                        );
                    });
                } catch (e) {
                    await debugLog({
                        variables: {
                            status: 'APPLE PAY',
                            message: 'Shipping Error',
                            debug: e.message
                        }
                    });
                }
            };

            session.onpaymentauthorized = async event => {
                try {
                    const paymentInformation = event.payment;
                    paymentInformation.is_checkout = isCheckout;

                    if (!isCheckout) {
                        const cartDetailsData = await setShippingAddress({
                            variables: {
                                cartId,
                                address: JSON.stringify(paymentInformation)
                            }
                        });
                        await debugLog({
                            variables: {
                                status: 'APPLE PAY',
                                message: 'Order Details in Card Page',
                                debug: JSON.stringify(cartDetailsData)
                            }
                        });
                        const data = {
                            cart: cartDetailsData.data.applePaySetShippingAddress
                        };

                        await debugLog({
                            variables: {
                                status: 'APPLE PAY',
                                message: 'Set Order Data Before Set Storage',
                                debug: JSON.stringify(data)
                            }
                        });
                        storage.setItem('checkout_order_data', data);
                    }

                    const results = await placeOrder({
                        variables: {
                            cartId,
                            information: JSON.stringify(paymentInformation)
                        }
                    });

                    await removeCart();
                    await apolloClient.clearCacheData(apolloClient, 'cart');

                    await createCart({
                        fetchCartId
                    });

                    await debugLog({
                        variables: {
                            status: 'APPLE PAY',
                            message: 'Get Results',
                            debug: JSON.stringify(results)
                        }
                    });

                    if (results?.data?.applePayPlaceOrder?.order?.error) {
                        const result = {
                            status: globalThis.ApplePaySession.STATUS_FAILURE
                        };
                        await debugLog({
                            variables: {
                                status: 'APPLE PAY',
                                message: 'Set status STATUS_FAILURE',
                                debug: JSON.stringify(result)
                            }
                        });
                        addToast({
                            type: ToastType.ERROR,
                            message: results?.data?.applePayPlaceOrder?.order?.error
                        })
                        session.completePayment(result);
                        return;
                    } else {
                        const result = {
                            status: globalThis.ApplePaySession.STATUS_SUCCESS
                        };
                        await debugLog({
                            variables: {
                                status: 'APPLE PAY',
                                message: 'Set status STATUS_SUCCESS',
                                debug: JSON.stringify(result)
                            }
                        });
                        session.completePayment(result);
                    }

                    if (isCheckout) {
                        await debugLog({
                            variables: {
                                status: 'APPLE PAY',
                                message: 'Order Details',
                                debug: JSON.stringify(orderDetailsData)
                            }
                        });
                        storage.setItem('checkout_order_data', orderDetailsData);
                    }

                    await debugLog({
                        variables: {
                            status: 'APPLE PAY',
                            message: 'Set Order Number Before Set Storage',
                            debug: JSON.stringify(results?.data?.applePayPlaceOrder?.order?.order_number)
                        }
                    });
                    storage.setItem('checkout_order_number', results?.data?.applePayPlaceOrder?.order?.order_number);

                    if (results?.data?.applePayPlaceOrder?.order?.redirect_url) {
                        !!location && location.replace(results.data.applePayPlaceOrder.order.redirect_url);
                    }
                } catch (e) {
                    await debugLog({
                        variables: {
                            status: 'APPLE PAY',
                            message: 'Place Order Error',
                            debug: e.message
                        }
                    });
                    addToast({
                        type: ToastType.ERROR,
                        message: e.message
                    });
                    session.completePayment({
                        status: globalThis.ApplePaySession.STATUS_FAILURE
                    });
                }
            };

            session.begin();
            setIsPlacingOrder(false);
        }
    }, [
        flatData,
        session,
        setSession,
        orderDetailsData,
        isPlacingOrder,
        appleAddress,
        setShipping,
        cartId,
        debugLog,
        isCheckout,
        placeOrder,
        requestTotals,
        setIsCartUpdating,
        setShippingLoading
    ]);

    const handleApplePlaceOrder = useCallback(async () => {
        setSession(new globalThis.ApplePaySession(3, getDataFromTotals(flatData)));
        await getOrderDetails({
            variables: {
                cartId
            }
        });
        setIsPlacingOrder(true);
    }, [flatData, getOrderDetails, cartId]);

    /**
     *
     * @type {(function(): void)|*}
     */
    const onBillingAddressChangedError = useCallback(() => {
        resetShouldSubmit();
    }, [resetShouldSubmit]);

    /**
     * This function will be called if address was successfully set.
     */
    const onBillingAddressChangedSuccess = useCallback(() => {
        updatePaymentMethod({
            variables: {
                cartId
            }
        });
    }, [updatePaymentMethod, cartId]);

    useEffect(() => {
        const paymentMethodMutationCompleted = paymentMethodMutationCalled && !paymentMethodMutationLoading;

        if (paymentMethodMutationCompleted && !paymentMethodMutationError) {
            onPaymentSuccess();
        }

        if (paymentMethodMutationCompleted && paymentMethodMutationError) {
            onPaymentError();
        }
    }, [
        paymentMethodMutationError,
        paymentMethodMutationLoading,
        paymentMethodMutationCalled,
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit
    ]);

    const isApplicable = !!globalThis.ApplePaySession;

    return {
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        handleApplePlaceOrder,
        isApplicable,
        isCheckout,
        shouldSubmit: isPlacingOrder
    };
};
