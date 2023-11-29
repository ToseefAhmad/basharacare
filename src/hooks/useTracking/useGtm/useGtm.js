import { useCallback } from 'react';

import { TrackingActions } from '@app/hooks/useTracking';

export const useGtm = () => {
    const handleEvent = useCallback(action => {
        if (typeof dataLayer === 'undefined') {
            return;
        }

        let displayMode = 'Browser';
        if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
            displayMode = 'App';
        }

        switch (action.type) {
            case TrackingActions.trackPageView:
                dataLayer.push({
                    event: 'virtualPageView',
                    displayMode: displayMode,
                    pageUrl: globalThis.location.href,
                    title: action.payload.title
                });
                return;
            case TrackingActions.trackAddToCart:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'add_to_cart',
                    displayMode: displayMode,
                    ecommerce: {
                        items: action.payload.products.map(product => ({
                            item_id: product.sku,
                            item_name: product.name,
                            price: product.price,
                            currency: product.currency,
                            quantity: product.quantity,
                            item_category: product.category,
                            item_brand: product.brand
                        }))
                    }
                });
                return;
            case TrackingActions.trackAddToWishlist:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'add_to_wishlist',
                    displayMode: displayMode,
                    ecommerce: {
                        items: action.payload.products.map(product => ({
                            item_id: product.sku,
                            item_name: product.name,
                            price: product.price,
                            currency: product.currency,
                            quantity: product.quantity,
                            item_category: product.category,
                            item_brand: product.brand
                        }))
                    }
                });
                return;
            case TrackingActions.trackRemoveFromCart:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'remove_from_cart',
                    displayMode: displayMode,
                    ecommerce: {
                        items: action.payload.products.map(product => ({
                            item_id: product.sku,
                            item_name: product.name,
                            price: product.price,
                            currency: product.currency,
                            quantity: product.quantity,
                            item_category: product.category,
                            item_brand: product.brand
                        }))
                    }
                });
                return;
            case TrackingActions.trackProductsListView:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'view_item_list',
                    displayMode: displayMode,
                    ecommerce: {
                        items: action.payload.products.map(product => ({
                            item_list_name: action.payload.list,
                            item_id: product.sku,
                            item_name: product.name,
                            currency: product.currency,
                            price: product.price,
                            item_category: product.category,
                            item_brand: product.brand,
                            index: product.position
                        }))
                    }
                });
                return;
            case TrackingActions.trackProductView:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'view_item',
                    displayMode: displayMode,
                    ecommerce: {
                        items: [
                            {
                                item_id: action.payload.product.sku,
                                item_name: action.payload.product.name,
                                price: action.payload.product.price,
                                currency: action.payload.product.currency,
                                item_category: action.payload.product.category,
                                item_brand: action.payload.product.brand
                            }
                        ]
                    }
                });
                return;
            case TrackingActions.trackProductClick:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'select_item',
                    displayMode: displayMode,
                    ecommerce: {
                        items: [
                            {
                                item_list_name: action.payload.list,
                                item_id: action.payload.product.sku,
                                item_name: action.payload.product.name,
                                price: action.payload.product.price,
                                currency: action.payload.product.currency,
                                item_category: action.payload.product.category,
                                item_brand: action.payload.product.brand
                            }
                        ]
                    }
                });
                return;
            case TrackingActions.trackOpenCheckout:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'begin_checkout',
                    displayMode: displayMode,
                    ecommerce: {
                        items: action.payload.products.map(product => ({
                            item_id: product.sku,
                            item_name: product.name,
                            price: product.price,
                            currency: product.currency,
                            quantity: product.quantity,
                            item_category: product.category,
                            item_brand: product.brand
                        }))
                    }
                });
                return;
            case TrackingActions.trackPurchase:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'purchase',
                    displayMode: displayMode,
                    ecommerce: {
                        transaction_id: action.payload.orderId,
                        value: action.payload.revenue,
                        currency: action.payload.currency,
                        coupon: action.payload.coupon,
                        tax: action.payload.tax,
                        shipping: action.payload.shipping,
                        items: action.payload.products.map(product => ({
                            item_id: product.sku,
                            item_name: product.name,
                            price: product.price,
                            currency: product.currency,
                            quantity: product.quantity,
                            item_category: product.category,
                            item_brand: product.brand
                        }))
                    }
                });
                return;
            case TrackingActions.trackCheckoutStep:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'checkout',
                    displayMode: displayMode,
                    ecommerce: {
                        checkout: {
                            actionField: {
                                step: action.payload.stepNum,
                                option: action.payload.option
                            },
                            products: action.payload.products.map(product => ({
                                name: product.name,
                                id: product.sku,
                                price: product.price,
                                category: product.category,
                                quantity: product.quantity
                            }))
                        }
                    }
                });
                return;
            case TrackingActions.trackInitiatesPersonalRoutine:
                dataLayer.push({
                    event: 'initiate_personal_routine',
                    displayMode: displayMode
                });
                return;
            case TrackingActions.trackCompletesPersonalRoutine:
                dataLayer.push({
                    event: 'completes_personal_routine',
                    displayMode: displayMode
                });
                return;
            case TrackingActions.trackSurveyStep:
                dataLayer.push({ ecommerce: null });
                dataLayer.push({
                    event: 'survey',
                    displayMode: displayMode,
                    ecommerce: {
                        items: {
                            actionField: {
                                step: action.payload.step,
                                option: action.payload.option
                            }
                        }
                    }
                });
                return;
            case TrackingActions.trackSignUp:
                dataLayer.push({
                    event: 'sign_up',
                    displayMode: displayMode
                });
                return;
            case TrackingActions.trackPwaInstall:
                dataLayer.push({
                    event: 'pwa_install',
                    displayMode: displayMode
                });
                return;
            case TrackingActions.trackPwaUninstall:
                dataLayer.push({
                    event: 'pwa_uninstall',
                    displayMode: displayMode
                });
                return;
            default:
        }
    }, []);

    return {
        handleEvent
    };
};
