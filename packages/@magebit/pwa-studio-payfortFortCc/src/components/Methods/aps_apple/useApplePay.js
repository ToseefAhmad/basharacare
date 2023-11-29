import { useLazyQuery, useMutation, useQuery } from '@apollo/client';
import DEFAULT_OPERATIONS from '@magebit/pwa-studio-payfortFortCc/src/talons/payment.gql';
import { useState, useCallback, useEffect } from 'react';

import CHECKOUT_OPERATIONS from '@app/components/overrides/CheckoutPage/checkoutPage.gql';
import SHIPPING_OPERATIONS from '@app/components/overrides/CheckoutPage/ShippingMethod/shippingMethod.gql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { Magento2 } from '@magento/peregrine/lib/RestApi';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const { request } = Magento2;

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
        applePaySetLoggerMutation,
        getOrderDetailsQuery,
        setShippingMethodMutation
    } = operations;

    const [{ cartId }] = useCartContext();
    const [isPlacingOrder, setIsPlacingOrder] = useState(false);
    const { data } = useQuery(getPaymentConfigQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
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

    const [debugLog] = useMutation(applePaySetLoggerMutation);

    const [placeOrder] = useMutation(applePayPlaceOrderMutation);

    const [setShipping, { loading: setShippingLoading }] = useMutation(applePaySetShippingMutation);

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

            session.onpaymentmethodselected = () => {
                const totalsData = getDataFromTotals(flatData);
                session.completePaymentMethodSelection({
                    newTotal: totalsData.total,
                    newLineItems: totalsData.lineItems
                });
            };

            session.onshippingmethodselected = event => {
                const data = Object.assign(appleAddress, { method: event.shippingMethod.identifier });
                requestTotals(data, totals => {
                    session.completeShippingMethodSelection(totals);
                }).then(result => {
                    debugLog({
                        variables: {
                            debug: 'Result shippingmethodselected merchant:' + result
                        }
                    });
                }).catch(error => {
                    debugLog({
                        variables: {
                            debug: 'Error shippingmethodselected merchant:' + error
                        }
                    });
                });
            };

            session.onshippingcontactselected = async event => {
                setAppleAddress(event.shippingContact);
                try {
                    const result = await setShipping({
                        variables: {
                            cartId,
                            address: JSON.stringify(appleAddress)
                        }
                    });

                    let data = appleAddress;
                    if (result?.data?.applePaySetShipping?.newShippingMethods) {
                        const defaultShippingMethod = result?.data?.applePaySetShipping?.newShippingMethods[0];
                        data = Object.assign(data, {
                            method: defaultShippingMethod.identifier
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
                            debug: 'shipping_error_request'
                        }
                    });
                }
            };

            session.onpaymentauthorized = async event => {
                try {
                    await debugLog({
                        variables: {
                            debug: 'Load onpaymentauthorized merchant'
                        }
                    });
                    const paymentInformation = event.payment;
                    paymentInformation.is_checkout = isCheckout;
                    const results = await placeOrder({
                        variables: {
                            cartId,
                            information: JSON.stringify(paymentInformation)
                        }
                    });

                    const result = {
                        status: ApplePaySession.STATUS_FAILURE
                    };

                    if (placeOrderData.error) {
                        session.completePayment(result);
                        return;
                    }

                    result.status = ApplePaySession.STATUS_SUCCESS;

                    session.completePayment(result);

                    storage.setItem('checkout_order_data', orderDetailsData);
                    storage.setItem('checkout_order_number', results?.data?.applePayPlaceOrder?.order?.order_number);

                    if (placeOrderData.redirect_url) {
                        !!location && location.replace(placeOrderData.redirect_url);
                    }
                } catch (e) {
                    await debugLog({
                        variables: {
                            debug: 'place_order_error'
                        }
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
        title: data?.storeConfig?.payment_payfort_applepay_title || '',
        onBillingAddressChangedError,
        onBillingAddressChangedSuccess,
        handleApplePlaceOrder,
        isApplicable,
        isCheckout
    };
};
