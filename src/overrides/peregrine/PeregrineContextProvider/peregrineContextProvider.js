import React from 'react';

import CartContextProvider from '../context/cart';

import AppContextProvider from '@magento/peregrine/lib/context/app';
import CatalogContextProvider from '@magento/peregrine/lib/context/catalog';
import RootComponentsProvider from '@magento/peregrine/lib/context/rootComponents';
import ErrorContextProvider from '@magento/peregrine/lib/context/unhandledErrors';
import UserContextProvider from '@magento/peregrine/lib/context/user';

/**
 * List of essential context providers that are required to run Peregrine
 *
 * @property {React.Component[]} contextProviders
 */
const contextProviders = [
    ErrorContextProvider,
    AppContextProvider,
    UserContextProvider,
    CatalogContextProvider,
    CartContextProvider,
    RootComponentsProvider
];

const PeregrineContextProvider = ({ children }) => {
    return contextProviders.reduceRight((memo, ContextProvider) => {
        return <ContextProvider>{memo}</ContextProvider>;
    }, children);
};

export default PeregrineContextProvider;
