import { useCallback } from 'react';

import { TrackingActions } from '@app/hooks/useTracking';

export const useFb = () => {
    const handleEvent = useCallback(action => {
        if (typeof fbq === 'undefined') {
            return;
        }

        switch (action.type) {
            case TrackingActions.trackAddToCart:
                const product = action.payload.products[0];
                fbq('track', 'AddToCart', {
                    content_type: 'product',
                    currency: product.currency,
                    content_ids: [product.sku],
                    content_name: product.name,
                    content_category: product.category,
                    value: product.price
                });
                return;
            case TrackingActions.trackAddToWishlist:
                const wishlistProduct = action.payload.products[0];
                fbq('track', 'AddToWishlist', {
                    content_type: 'product',
                    currency: wishlistProduct.currency,
                    content_ids: [wishlistProduct.sku],
                    content_name: wishlistProduct.name,
                    content_category: wishlistProduct.category,
                    value: wishlistProduct.price
                });
                return;
            case TrackingActions.trackProductView:
                fbq('track', 'ViewContent', {
                    content_type: 'product',
                    content_ids: [action.payload.product.sku],
                    content_name: action.payload.product.name,
                    content_category: action.payload.product.category,
                    value: action.payload.product.price,
                    currency: action.payload.product.currency
                });
                return;
            case TrackingActions.trackOpenCheckout:
                fbq('track', 'InitiateCheckout', {
                    content_type: 'product',
                    content_ids: action.payload.products.map(product => product.sku),
                    num_items: action.payload.products.length,
                    contents: action.payload.products.map(product => ({
                        id: product.sku,
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
                fbq('track', 'Purchase', {
                    content_type: 'product',
                    content_ids: action.payload.products.map(product => product.sku),
                    contents: action.payload.products.map(product => ({
                        id: product.sku,
                        quantity: product.quantity,
                        item_price: product.price
                    })),
                    value: action.payload.revenue,
                    currency: action.payload.currency
                });
                return;
            case TrackingActions.trackSignUp:
                fbq('track', 'CompleteRegistration');
                return;
            case TrackingActions.trackPageView:
                fbq('track', 'PageView');
                return;
            default:
        }
    }, []);

    return {
        handleEvent
    };
};
