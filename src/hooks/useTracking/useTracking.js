import { useCallback, useMemo } from 'react';
import { useCookies } from 'react-cookie';

import { useFb } from '@app/hooks/useTracking/useFb';
import { useGtm } from '@app/hooks/useTracking/useGtm';
import { useTikTok } from '@app/hooks/useTracking/useTikTok';

export const TrackingActions = {
    trackAddToCart: 'TRACKING/ADD_TO_CART',
    trackAddToWishlist: 'TRACKING/ADD_TO_WISHLIST',
    trackOpenCheckout: 'TRACKING/OPEN_CHECKOUT',
    trackPurchase: 'TRACKING/PURCHASE',
    trackProductsListView: 'TRACKING/PRODUCTS_LIST_VIEW',
    trackRemoveFromCart: 'TRACKING/REMOVE_FROM_CART',
    trackProductView: 'TRACKING/PRODUCT_VIEW',
    trackProductClick: 'TRACKING/PRODUCT_CLICK',
    trackPageView: 'TRACKING/PAGE_VIEW',
    trackSignUp: 'TRACKING/SIGN_UP',
    trackCheckoutStep: 'TRACKING/CHECKOUT_STEP',
    trackInitiatesPersonalRoutine: 'TRACKING/INITIATES_PERSONAL_ROUTINE',
    trackCompletesPersonalRoutine: 'TRACKING/COMPLETES_PERSONAL_ROUTINE',
    trackSurveyStep: 'TRACKING/SKIN_TEST_STEP',
    trackPwaInstall: 'TRACKING/PWA_INSTALL',
    trackPwaUninstall: 'TRACKING/PWA_UNINSTALL'
};

export const useTracking = () => {
    const { handleEvent: handleGtmEvent } = useGtm();
    const { handleEvent: handleFbEvent } = useFb();
    const { handleEvent: handleTikTokEvent } = useTikTok();
    const [cookies] = useCookies();

    const appType = useMemo(() => {
        return cookies?.['application-type'] || 'web';
    }, [cookies]);

    const consent = useMemo(() => {
        return cookies?.['tracking-consent'] || false;
    }, [cookies]);

    const handleEvent = useCallback(
        (type, payload) => {
            if (appType === 'ios' && consent === 'true') {
                return;
            }
            const action = { type, payload };
            handleGtmEvent(action);
            handleFbEvent(action);
            handleTikTokEvent(action);
        },
        [appType, consent, handleGtmEvent, handleFbEvent, handleTikTokEvent]
    );

    const trackAddToCart = useCallback(
        payload => {
            handleEvent(TrackingActions.trackAddToCart, payload);
        },
        [handleEvent]
    );

    const trackAddToWishlist = useCallback(
        payload => {
            handleEvent(TrackingActions.trackAddToWishlist, payload);
        },
        [handleEvent]
    );

    const trackOpenCheckout = useCallback(
        payload => {
            handleEvent(TrackingActions.trackOpenCheckout, payload);
        },
        [handleEvent]
    );

    const trackPurchase = useCallback(
        payload => {
            handleEvent(TrackingActions.trackPurchase, payload);
        },
        [handleEvent]
    );

    const trackRemoveFromCart = useCallback(
        payload => {
            handleEvent(TrackingActions.trackRemoveFromCart, payload);
        },
        [handleEvent]
    );

    const trackProductView = useCallback(
        payload => {
            handleEvent(TrackingActions.trackProductView, payload);
        },
        [handleEvent]
    );

    const trackProductsListView = useCallback(
        payload => {
            handleEvent(TrackingActions.trackProductsListView, payload);
        },
        [handleEvent]
    );

    const trackProductClick = useCallback(
        payload => {
            handleEvent(TrackingActions.trackProductClick, payload);
        },
        [handleEvent]
    );

    const trackPageView = useCallback(
        payload => {
            handleEvent(TrackingActions.trackPageView, payload);
        },
        [handleEvent]
    );

    const trackSignUpClick = useCallback(
        payload => {
            handleEvent(TrackingActions.trackSignUp, payload);
        },
        [handleEvent]
    );

    const trackPwaInstall = useCallback(
        payload => {
            handleEvent(TrackingActions.trackPwaInstall, payload);
        },
        [handleEvent]
    );

    const trackPwaUninstall = useCallback(
        payload => {
            handleEvent(TrackingActions.trackPwaUninstall, payload);
        },
        [handleEvent]
    );

    const trackCheckoutStep = useCallback(
        payload => {
            handleEvent(TrackingActions.trackCheckoutStep, payload);
        },
        [handleEvent]
    );

    const trackInitiatesPersonalRoutine = useCallback(
        payload => {
            handleEvent(TrackingActions.trackInitiatesPersonalRoutine, payload);
        },
        [handleEvent]
    );

    const trackCompletesPersonalRoutine = useCallback(
        payload => {
            handleEvent(TrackingActions.trackCompletesPersonalRoutine, payload);
        },
        [handleEvent]
    );

    const trackSurveyStep = useCallback(
        payload => {
            handleEvent(TrackingActions.trackSurveyStep, payload);
        },
        [handleEvent]
    );

    const getBreadcrumbCategoryId = categories => {
        // Exit if there are no categories for this product.
        if (!categories || !categories.length) {
            return;
        }
        const breadcrumbSet = new Set();
        categories.forEach(({ breadcrumbs }) => {
            // Breadcrumbs can be `null`...
            (breadcrumbs || []).forEach(({ category_id }) => breadcrumbSet.add(category_id));
        });

        /* Until we can get the single canonical breadcrumb path to a product we
        will just return the first category id of the potential leaf categories. **/
        const leafCategory = categories.find(category => !breadcrumbSet.has(category.uid));

        /* If we couldn't find a leaf category then just use the first category
        in the list for this product. **/
        return leafCategory.uid || categories[0].uid;
    };

    const getProductCategories = useCallback(categories => {
        if (!categories || !categories.length) {
            return '';
        }

        const categoryId = getBreadcrumbCategoryId(categories);
        const category = categories.find(cat => cat.uid === categoryId);

        if (category) {
            return `${(category.breadcrumbs &&
                category.breadcrumbs.map(breadcrumb => breadcrumb.category_name).join('/') + '/') ||
                ''}${category.name}`;
        }
    }, []);

    return {
        trackAddToCart,
        trackAddToWishlist,
        trackProductsListView,
        trackOpenCheckout,
        trackPurchase,
        trackProductView,
        trackRemoveFromCart,
        trackProductClick,
        trackPageView,
        trackSignUpClick,
        getProductCategories,
        trackCheckoutStep,
        trackInitiatesPersonalRoutine,
        trackCompletesPersonalRoutine,
        trackSurveyStep,
        trackPwaInstall,
        trackPwaUninstall
    };
};
