import React, { createContext, useContext, useReducer, useRef } from 'react';

import { checkoutReducer, createCheckoutDispatchers, initialCheckoutDispatchers, initialState } from './reducer';

const initialContext = [initialState, initialCheckoutDispatchers];

export const CheckoutContext = createContext(initialContext);

export const CheckoutContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(checkoutReducer, initialState);
    const dispatchers = useRef(createCheckoutDispatchers(dispatch)).current;

    return <CheckoutContext.Provider value={[state, dispatchers]}>{children}</CheckoutContext.Provider>;
};

export const useCheckoutContext = () => useContext(CheckoutContext);
