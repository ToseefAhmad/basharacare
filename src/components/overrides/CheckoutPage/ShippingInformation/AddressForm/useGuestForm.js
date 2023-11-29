import { useMutation, useLazyQuery } from '@apollo/client';
import { useCallback, useMemo, useState, useEffect } from 'react';

import PAYMENT_OPERATIONS from '../../PaymentInformation/paymentInformation.gql';

import { useCheckoutContext } from '@app/context/Checkout';
import { useDefaultCountry } from '@app/hooks/useDefaultCountry/useDefaultCountry';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/AddressForm/guestForm.gql.js';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useGuestForm = props => {
    const { afterSubmit, onCancel, onSuccess, shippingData, setShowSignInToast } = props;
    const [, { setShippingAddress }] = useCheckoutContext();

    const operations = mergeOperations(DEFAULT_OPERATIONS, PAYMENT_OPERATIONS, props.operations);
    const { setGuestShippingMutation, getEmailAvailableQuery, setBillingAddressMutation } = operations;

    const [{ cartId }] = useCartContext();

    const [setBillingAddress] = useMutation(setBillingAddressMutation);
    const [setGuestShipping, { error, loading }] = useMutation(setGuestShippingMutation, {
        onCompleted: () => {
            onSuccess();
        }
    });

    const [runQuery, { data }] = useLazyQuery(getEmailAvailableQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const { defaultCountry } = useDefaultCountry();

    const country = shippingData ? shippingData.country : { code: defaultCountry };

    const { code: countryCode } = country;

    const initialValues = {
        ...shippingData,
        country: countryCode
    };

    // Simple heuristic to indicate form was submitted prior to this render
    const isUpdate = !!shippingData?.city;

    const handleSubmit = useCallback(
        async formValues => {
            const { country, email, ...address } = formValues;
            setShippingAddress({ email, address });
            try {
                await setGuestShipping({
                    variables: {
                        cartId,
                        email,
                        address: {
                            ...address,
                            // Cleans up the street array when values are null or undefined
                            street: address.street.filter(e => e),
                            country_code: country
                        }
                    }
                });
            } catch {
                return;
            }

            const { firstname, lastname, street, city, telephone } = address;
            const regionCode = '';
            const postcode = '';
            const countryCode = country;
            const streetValue = street.length === 0 ? '' : street[0];

            setBillingAddress({
                variables: {
                    cartId,
                    firstname,
                    lastname,
                    street: streetValue,
                    city,
                    regionCode,
                    postcode,
                    countryCode,
                    telephone
                }
            });

            if (afterSubmit) {
                afterSubmit();
            }
        },
        [afterSubmit, cartId, setGuestShipping, setShippingAddress, setBillingAddress]
    );

    const handleCancel = useCallback(() => {
        onCancel();
    }, [onCancel]);

    const handleValidateEmail = useCallback(
        email => {
            setShowSignInToast(false);
            if (email && email.includes('@')) {
                runQuery({ variables: { email } });
            }
        },
        [runQuery, setShowSignInToast]
    );

    const errors = useMemo(() => new Map([['setGuestShippingMutation', error]]), [error]);

    useEffect(() => {
        if (data) {
            setShowSignInToast(!data.isEmailAvailable.is_email_available);
        }
    }, [data, setShowSignInToast]);

    const [formData, setFormData] = useState(null);

    const [enableGuestFormSubmitButton, setEnableGuestFormSubmitButton] = useState(false);

    useEffect(() => {
        if (!formData) {
            return;
        }

        if (formData.invalid) {
            setEnableGuestFormSubmitButton(false);
            return;
        }

        if (Object.keys(formData.values).length == 7) {
            if (formData.values['street'].find((element, index) => index == 0)) {
                setEnableGuestFormSubmitButton(true);
            } else {
                setEnableGuestFormSubmitButton(false);
            }
        } else {
            setEnableGuestFormSubmitButton(false);
        }
    }, [formData]);

    return {
        errors,
        handleCancel,
        handleSubmit,
        handleValidateEmail,
        initialValues,
        isSaving: loading,
        isUpdate,
        formData,
        setFormData,
        enableGuestFormSubmitButton
    };
};
