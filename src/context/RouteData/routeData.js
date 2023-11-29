import React, { createContext, useContext, useMemo, useState } from 'react';

const RouteDataContext = createContext([{ routeData: {} }, { setRouteData() {} }]);

const RouteDataContextProvider = ({ children }) => {
    const [routeData, setRouteData] = useState({});

    const contextValue = useMemo(() => [{ routeData }, { setRouteData }], [routeData, setRouteData]);

    return <RouteDataContext.Provider value={contextValue}>{children}</RouteDataContext.Provider>;
};

export const useRouteDataContext = () => useContext(RouteDataContext);

export default RouteDataContextProvider;
