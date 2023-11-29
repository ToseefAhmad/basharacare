import { useCallback } from 'react';

import { TrackingActions } from '@app/hooks/useTracking';

const identify = payload => {
    const identity = {};

    if (payload.email) {
        identity.email = payload.email;
    }

    if (payload.telephone) {
        identity.phone_number = payload.telephone;
    }

    if (Object.keys(identity).length === 0) {
        return;
    }

    ttq.identify(identity);
};

export const useTikTok = () => {
    const handleEvent = useCallback(action => {
        if (typeof ttq === 'undefined') {
            return;
        }

        switch (action.type) {
            case TrackingActions.trackAddToCart:
                const product = action.payload.products[0];
                ttq.track('AddToCart', {
                    content_type: 'product',
                    currency: product.currency,
                    content_id: product.sku,
                    content_name: product.name,
                    content_category: product.category,
                    value: product.price
                });
                return;
            case TrackingActions.trackAddToWishlist:
                const wishlistProduct = action.payload.products[0];
                ttq.track('AddToWishlist', {
                    content_type: 'product',
                    currency: wishlistProduct.currency,
                    content_id: wishlistProduct.sku,
                    content_name: wishlistProduct.name,
                    content_category: wishlistProduct.category,
                    value: wishlistProduct.price
                });
                return;
            case TrackingActions.trackProductView:
                ttq.track('ViewContent', {
                    content_type: 'product',
                    content_id: action.payload.product.sku,
                    content_name: action.payload.product.name,
                    content_category: action.payload.product.category,
                    value: action.payload.product.price,
                    currency: action.payload.product.currency
                });
                return;
            case TrackingActions.trackOpenCheckout:
                identify(action.payload);

                ttq.track('InitiateCheckout', {
                    content_type: 'product_group',
                    contents: action.payload.products.map(product => ({
                        content_type: 'product',
                        content_id: product.sku,
                        quantity: product.quantity,
                        item_price: product.price
                    })),
                    value: action.payload.products
                        .map(product => product.price * product.quantity)
                        .reduce((a, b) => a + b, 0),
                    currency: action.payload.products[0]?.currency
                });
                return;
            case TrackingActions.trackPurchase:
                identify(action.payload);

                ttq.track('PlaceAnOrder', {
                    content_type: 'product_group',
                    contents: action.payload.products.map(product => ({
                        content_type: 'product',
                        content_id: product.sku,
                        quantity: product.quantity,
                        item_price: product.price
                    })),
                    value: action.payload.revenue,
                    currency: action.payload.currency
                });
                return;
            case TrackingActions.trackSignUp:
                ttq.track('CompleteRegistration');
                return;
            case TrackingActions.trackPageView:
                ttq.page();
                return;
            default:
        }
    }, []);

    return {
        handleEvent
    };
};
