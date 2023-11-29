import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './shippingMethod.gql';

export const displayStates = {
    DONE: 'done',
    EDITING: 'editing',
    INITIALIZING: 'initializing'
};

const serializeShippingMethod = method => {
    const { carrier_code, method_code } = method;

    return `${carrier_code}|${method_code}`;
};

const deserializeShippingMethod = serializedValue => {
    return serializedValue.split('|');
};

// Sorts available shipping methods by price.
const byPrice = (a, b) => a.amount.value - b.amount.value;

// Adds a serialized property to shipping method objects
// So they can be selected in the radio group.
const addSerializedProperty = shippingMethod => {
    if (!shippingMethod) return shippingMethod;

    const serializedValue = serializeShippingMethod(shippingMethod);

    return {
        ...shippingMethod,
        serializedValue
    };
};

const DEFAULT_SELECTED_SHIPPING_METHOD = null;
const DEFAULT_AVAILABLE_SHIPPING_METHODS = [];

export const useShippingMethod = props => {
    const { onSave, onSuccess, setPageIsUpdating } = props;

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const {
        getSelectedAndAvailableShippingMethodsQuery,
        setShippingMethodMutation,
        getDeliveryInputOptions,
        setDeliveryDate
    } = operations;

    const [{ cartId }] = useCartContext();
    const [{ isSignedIn }] = useUserContext();

    const { data: inputData } = useQuery(getDeliveryInputOptions, {
        fetchPolicy: 'cache-and-network',
        skip: !cartId,
        variables: {
            cartId
        }
    });

    /*
     *  Apollo Hooks.
     */
    const [setShippingMethodCall, { error: setShippingMethodError, loading: isSettingShippingMethod }] = useMutation(
        setShippingMethodMutation,
        {
            onCompleted: () => {
                onSuccess();
            }
        }
    );

    const [sendDeliverySelection] = useMutation(setDeliveryDate);

    const { data, loading: isLoadingShippingMethods } = useQuery(getSelectedAndAvailableShippingMethodsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !cartId,
        variables: { cartId }
    });

    /*
     *  State / Derived state.
     */
    const [isUpdateMode, setIsUpdateMode] = useState(false);

    const hasData = data?.cart?.shipping_addresses?.[0]?.selected_shipping_method;

    const derivedPrimaryShippingAddress = data?.cart?.shipping_addresses?.length
        ? data.cart.shipping_addresses[0]
        : null;

    const derivedSelectedShippingMethod = derivedPrimaryShippingAddress
        ? addSerializedProperty(derivedPrimaryShippingAddress.selected_shipping_method)
        : DEFAULT_SELECTED_SHIPPING_METHOD;

    const shippingCity = useMemo(() => {
        return derivedPrimaryShippingAddress?.city;
    }, [derivedPrimaryShippingAddress]);

    const derivedShippingMethods = useMemo(() => {
        if (!derivedPrimaryShippingAddress) return DEFAULT_AVAILABLE_SHIPPING_METHODS;

        // Shape the list of available shipping methods.
        // Sort them by price and add a serialized property to each.
        const rawShippingMethods = derivedPrimaryShippingAddress.available_shipping_methods;
        const shippingMethodsByPrice = [...rawShippingMethods].sort(byPrice);
        const result = shippingMethodsByPrice.map(addSerializedProperty);

        return result;
    }, [derivedPrimaryShippingAddress]);

    const lowestCostShippingMethodSerializedValue = derivedShippingMethods.length
        ? derivedShippingMethods[0].serializedValue
        : '';
    const initialShippingValue = useMemo(() => {
        return {
            shipping_method: lowestCostShippingMethodSerializedValue
        };
    }, [lowestCostShippingMethodSerializedValue]);

    // Determine the component's display state.
    const isBackgroundAutoSelecting =
        isSignedIn && !derivedSelectedShippingMethod && Boolean(derivedShippingMethods.length);
    const displayState = derivedSelectedShippingMethod
        ? displayStates.DONE
        : isLoadingShippingMethods || (isSettingShippingMethod && isBackgroundAutoSelecting)
        ? displayStates.INITIALIZING
        : displayStates.EDITING;

    /*
     *  Callbacks.
     */

    const [selectedMethod, setSelectedMethod] = useState(initialShippingValue.shipping_method);

    useEffect(() => {
        // Re-set shipping method if initial shipping method was not loaded at first
        if (!selectedMethod && initialShippingValue?.shipping_method) {
            setSelectedMethod(initialShippingValue.shipping_method);
        }
    }, [initialShippingValue, selectedMethod, setSelectedMethod]);

    const handleChangeDeliveryMethod = e => {
        setSelectedMethod(e.target.value);
    };

    const shippingMethodReformat = selectedMethod && selectedMethod.replace('|', '_');
    const methodId =
        inputData?.getCartDeliveryDate?.available_limits?.find(option => option.method === shippingMethodReformat)
            ?.entity_id || null;

    const handleSubmit = useCallback(
        async value => {
            const { time, comment, date } = value;
            const selectedTime = time?.split(' ');

            const [carrierCode, methodCode] = deserializeShippingMethod(value.shipping_method);

            try {
                await setShippingMethodCall({
                    variables: {
                        cartId,
                        shippingMethod: {
                            carrier_code: carrierCode,
                            method_code: methodCode
                        }
                    }
                });
                if (selectedTime) {
                    await sendDeliverySelection({
                        variables: {
                            input: {
                                cartId,
                                optionId: methodId,
                                date,
                                from: selectedTime[0],
                                to: selectedTime[1],
                                comment
                            }
                        }
                    });
                }
            } catch {
                return;
            }

            setIsUpdateMode(false);
        },
        [cartId, setIsUpdateMode, setShippingMethodCall, methodId, sendDeliverySelection]
    );

    const handleCancelUpdate = useCallback(() => {
        setIsUpdateMode(false);
    }, []);

    const showUpdateMode = useCallback(() => {
        setIsUpdateMode(true);
    }, []);

    /*
     *  Effects.
     */

    // When we have data we should tell the checkout page
    // So that it can set the step correctly.
    useEffect(() => {
        if (hasData) {
            onSave();
        }
    }, [hasData, onSave]);

    useEffect(() => {
        setPageIsUpdating(isSettingShippingMethod);
    }, [isLoadingShippingMethods, isSettingShippingMethod, setPageIsUpdating]);

    // If an authenticated user does not have a preferred shipping method,
    // Auto-select the least expensive one for them.
    useEffect(() => {
        if (!data) return;
        if (!cartId) return;
        if (!isSignedIn) return;

        if (!derivedSelectedShippingMethod) {
            // The shipping methods are sorted by price.
            const leastExpensiveShippingMethod = derivedShippingMethods[0];

            if (leastExpensiveShippingMethod) {
                const { carrier_code, method_code } = leastExpensiveShippingMethod;

                setShippingMethodCall({
                    variables: {
                        cartId,
                        shippingMethod: {
                            carrier_code,
                            method_code
                        }
                    }
                });
            }
        }
    }, [cartId, data, derivedSelectedShippingMethod, derivedShippingMethods, isSignedIn, setShippingMethodCall]);

    const errors = useMemo(() => new Map([['setShippingMethod', setShippingMethodError]]), [setShippingMethodError]);

    return {
        displayState,
        errors,
        handleCancelUpdate,
        handleSubmit,
        shippingCity,
        isLoading: isLoadingShippingMethods || isSettingShippingMethod,
        isUpdateMode,
        selectedShippingMethod: derivedSelectedShippingMethod,
        shippingMethods: derivedShippingMethods,
        showUpdateMode,
        deliveryInputOptions: inputData ? inputData.getCartDeliveryDate : null,
        handleChangeDeliveryMethod,
        selectedMethod
    };
};
