import { useMutation } from '@apollo/client';
import { useEffect, useState } from 'react';

import { useTracking } from '@app/hooks/useTracking';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { BrowserPersistence } from '@magento/peregrine/lib/util';

import { ALGOLIA_CONVERSION } from './orderConfirmationPage.gql';

const storage = new BrowserPersistence();

const getStorageData = () => {
    return storage.getItem('checkout_order_data');
};

export const flatten = data => {
    if (!data) return null;
    const { cart } = data;
    const { shipping_addresses } = cart;
    const address = shipping_addresses[0];

    const shippingMethod = `${address.selected_shipping_method.carrier_title} - ${
        address.selected_shipping_method.method_title
    }`;

    return {
        city: address.city,
        country: address.country.label,
        email: cart.email,
        firstname: address.firstname,
        lastname: address.lastname,
        postcode: address.postcode,
        region: address.region.label,
        shippingMethod,
        street: address.street,
        totalItemQuantity: cart.total_quantity
    };
};

export const useOrderConfirmationPage = props => {
    const { data, orderNumber } = props;

    const { trackPurchase, getProductCategories } = useTracking();

    const [{ isSignedIn }] = useUserContext();

    // Introduced a new variable in storage so that
    // I do not override the ability to open success page multiple times
    const isOrderTrackedInStorage = storage.getItem('checkout_order_tracked');
    const [isTrackPurchaseDone, setIsTrackPurchaseDone] = useState(isOrderTrackedInStorage === 'true');

    const [algoliaConversion] = useMutation(ALGOLIA_CONVERSION);

    useEffect(() => {
        if (orderNumber) {
            algoliaConversion({
                variables: {
                    input: {
                        orderId: orderNumber
                    }
                }
            });
        }
    }, [algoliaConversion, orderNumber]);

    useEffect(() => {
        if (data?.cart?.items?.length > 0 && !isTrackPurchaseDone) {
            trackPurchase({
                orderId: orderNumber,
                revenue: data.cart.prices?.grand_total.value,
                currency: data.cart.prices?.grand_total.currency,
                tax: data.cart.prices?.applied_taxes?.reduce((prev, curr) => prev + curr.amount.value, 0),
                shipping: data.cart.shipping_addresses[0]?.selected_shipping_method?.amount.value,
                coupon: data.cart.applied_coupons?.map(coupon => coupon.code).join(','),
                products: data.cart.items.map(item => ({
                    name: item.product.name,
                    sku: item.product.sku,
                    price: item.prices?.price?.value,
                    currency: item.prices?.price?.currency,
                    quantity: item.quantity,
                    category: getProductCategories(item.product.categories),
                    brand: item.product.brand_name
                })),
                email: data.cart.email,
                telephone: data.cart.shipping_addresses[0]?.telephone
            });
            setIsTrackPurchaseDone(true);
            storage.setItem('checkout_order_tracked', 'true');
        }
    }, [data, getProductCategories, isTrackPurchaseDone, orderNumber, trackPurchase]);

    return {
        flatData: flatten(data || getStorageData()),
        isSignedIn
    };
};
