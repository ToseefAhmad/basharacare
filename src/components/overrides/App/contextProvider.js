import AmIlnProvider from '@amasty/iln/src/context';
import React from 'react';

import CaptchaProvider from '@app/components/CaptchaProvider';
import { AppContextProvider } from '@app/context/App';
import { CheckoutContextProvider } from '@app/context/Checkout';
import InstantSearchWrapper from '@app/context/InstantSearch';
import RouteDataContextProvider from '@app/context/RouteData';
import {
    PeregrineContextProvider as Peregrine,
    ToastContextProvider,
    WindowSizeContextProvider
} from '@magento/peregrine';
import LocaleProvider from '@magento/venia-ui/lib/components/App/localeProvider';

/**
 * List of context providers that are required to run Venia
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [
    LocaleProvider,
    Peregrine,
    AppContextProvider,
    WindowSizeContextProvider,
    ToastContextProvider,
    CheckoutContextProvider,
    AmIlnProvider,
    CaptchaProvider,
    InstantSearchWrapper,
    RouteDataContextProvider
];

const ContextProvider = ({ children }) => {
    return contextProviders.reduceRight((memo, ContextProvider) => {
        return <ContextProvider>{memo}</ContextProvider>;
    }, children);
};

export default ContextProvider;
