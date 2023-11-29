import React, { createContext, useContext } from 'react';

import { useLabels } from './useLabels';

const AmProductLabelContext = createContext(undefined);
const { Provider } = AmProductLabelContext;

const AmProductLabelProvider = props => {
    const { products, productsFromVariants, children, mode } = props;

    const talonProps = useLabels({
        products,
        productsFromVariants,
        mode
    });

    const { error } = talonProps;

    if (error) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }
    }

    const contextValue = {
        ...talonProps
    };

    return <Provider value={contextValue}>{children}</Provider>;
};

export default AmProductLabelProvider;

export const useAmProductLabelContext = () => useContext(AmProductLabelContext);
