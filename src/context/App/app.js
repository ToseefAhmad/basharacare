import React, { createContext, useContext, useReducer, useRef } from 'react';

import { appReducer, createAppDispatchers, initialAppDispatchers, initialState } from './reducer';

const initialContext = [initialState, initialAppDispatchers];

export const AppContext = createContext(initialContext);

export const AppContextProvider = ({ children }) => {
    const [state, dispatch] = useReducer(appReducer, initialState);
    const dispatchers = useRef(createAppDispatchers(dispatch)).current;

    return <AppContext.Provider value={[state, dispatchers]}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
