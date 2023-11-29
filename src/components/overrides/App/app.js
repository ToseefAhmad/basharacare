import { array, func, shape, string } from 'prop-types';
import React, { Suspense, useCallback } from 'react';
import { AlertCircle as AlertCircleIcon, CloudOff as CloudOffIcon, Wifi as WifiIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { useCustomerDetails } from '@app/context/CustomerDetails';
import { useChangedRoutes } from '@app/hooks/useChangedRoutes';
import { useTracking } from '@app/hooks/useTracking';
import { useStoreConfig } from '@app/util/useStoreConfig';
import { useToasts, useTypePolicies } from '@magento/peregrine';
import useDelayedTransition from '@magento/peregrine/lib/hooks/useDelayedTransition';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';
import { useApp } from '@magento/peregrine/lib/talons/App/useApp';
import { HeadProvider, Meta, StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Main from '@magento/venia-ui/lib/components/Main';
import Mask from '@magento/venia-ui/lib/components/Mask';
import Navigation from '@magento/venia-ui/lib/components/Navigation';
import Routes from '@magento/venia-ui/lib/components/Routes';
import globalCSS from '@magento/venia-ui/lib/index.module.css';

import { CUSTOM_TYPE_POLICIES } from './typePolicies';

const ToastContainer = React.lazy(() => import('@magento/venia-ui/lib/components/ToastContainer'));

const OnlineIcon = <Icon src={WifiIcon} attrs={{ width: 18 }} />;
const OfflineIcon = <Icon src={CloudOffIcon} attrs={{ width: 18 }} />;
const ErrorIcon = <Icon src={AlertCircleIcon} attrs={{ width: 18 }} />;

const App = props => {
    const { markErrorHandled, renderError, unhandledErrors } = props;
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const { trackCompletesPersonalRoutine } = useTracking();
    const { innerWidth } = useWindowSize();

    useDelayedTransition();

    useCustomerDetails();
    useChangedRoutes({
        key: 'personalized-routine',
        callback: trackCompletesPersonalRoutine
    });
    useTypePolicies(CUSTOM_TYPE_POLICIES);
    useStoreConfig();

    const isMobile = innerWidth < 1024;

    const ERROR_MESSAGE = formatMessage({
        id: 'app.errorUnexpected',
        defaultMessage: 'Sorry! An unexpected error occurred.'
    });

    const handleIsOffline = useCallback(() => {
        addToast({
            type: 'error',
            icon: OfflineIcon,
            message: formatMessage({
                id: 'app.errorOffline',
                defaultMessage: 'You are offline. Some features may be unavailable.'
            }),
            timeout: 3000
        });
    }, [addToast, formatMessage]);

    const handleIsOnline = useCallback(() => {
        addToast({
            type: 'info',
            icon: OnlineIcon,
            message: formatMessage({
                id: 'app.infoOnline',
                defaultMessage: 'You are online.'
            }),
            timeout: 3000
        });
    }, [addToast, formatMessage]);

    const handleError = useCallback(
        (error, id, loc, handleDismissError) => {
            const errorToastProps = {
                icon: ErrorIcon,
                message: `${ERROR_MESSAGE}\nDebug: ${id} ${loc}`,
                onDismiss: remove => {
                    handleDismissError();
                    remove();
                },
                timeout: 15000,
                type: 'error'
            };

            addToast(errorToastProps);
        },
        [ERROR_MESSAGE, addToast]
    );

    const talonProps = useApp({
        handleError,
        handleIsOffline,
        handleIsOnline,
        markErrorHandled,
        renderError,
        unhandledErrors
    });

    const { hasOverlay, handleCloseDrawer } = talonProps;

    if (renderError) {
        return (
            <HeadProvider>
                <StoreTitle />
                <Meta name="prerender-status-code" content="500" />
                <Main isMasked={true} />
                <Mask isActive={true} />
                <Suspense fallback={null}>
                    <ToastContainer />
                </Suspense>
            </HeadProvider>
        );
    }

    return (
        <HeadProvider>
            <StoreTitle />
            <Routes />
            <Mask isActive={hasOverlay} dismiss={handleCloseDrawer} data-cy="App-Mask-button" />
            {isMobile && <Navigation />}
            <Suspense fallback={null}>
                <ToastContainer />
            </Suspense>
        </HeadProvider>
    );
};

App.propTypes = {
    markErrorHandled: func.isRequired,
    renderError: shape({
        stack: string
    }),
    unhandledErrors: array
};

App.globalCSS = globalCSS;

export default App;
