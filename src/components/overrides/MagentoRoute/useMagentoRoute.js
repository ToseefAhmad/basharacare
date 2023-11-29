import { useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

import { useRouteDataContext } from '@app/context/RouteData';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useRootComponents } from '@magento/peregrine/lib/context/rootComponents';
import { getRootComponent, isRedirect } from '@magento/peregrine/lib/talons/MagentoRoute/helpers';
import { getComponentData } from '@magento/peregrine/lib/util/magentoRouteData';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './magentoRoute.gql';

const getInlinedPageData = () => {
    return globalThis.INLINED_PAGE_TYPE && globalThis.INLINED_PAGE_TYPE.type ? globalThis.INLINED_PAGE_TYPE : null;
};

const resetInlinedPageData = () => {
    globalThis.INLINED_PAGE_TYPE = false;
};

export const useMagentoRoute = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { resolveUrlQuery } = operations;
    const { replace } = useHistory();
    const { pathname } = useLocation();
    const [componentMap, setComponentMap] = useRootComponents();

    const initialized = useRef(false);
    const fetchedPathname = useRef(null);
    const [, { setRouteData }] = useRouteDataContext();

    const [appState, appApi] = useAppContext();
    const { actions: appActions } = appApi;
    const { nextRootComponent } = appState;
    const { setNextRootComponent, setPageLoading } = appActions;

    const setComponent = useCallback(
        (key, value) => {
            setComponentMap(prevMap => new Map(prevMap).set(key, value));
        },
        [setComponentMap]
    );

    const component = componentMap.get(pathname);

    const [runQuery, queryResult] = useLazyQuery(resolveUrlQuery);
    // Destructure the query result
    const { data, error, loading } = queryResult;
    const { route } = data || {};

    useEffect(() => {
        if (initialized.current || !getInlinedPageData()) {
            runQuery({
                fetchPolicy: 'cache-and-network',
                nextFetchPolicy: 'cache-first',
                variables: { url: pathname }
            });
            fetchedPathname.current = pathname;
        }
    }, [initialized, pathname]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        const inlineData = getInlinedPageData();

        if (!initialized.current && inlineData) {
            setRouteData(inlineData);
        } else if (queryResult?.data?.route) {
            setRouteData(queryResult?.data?.route);
        }
    }, [queryResult, setRouteData]);

    useEffect(() => {
        if (component) {
            return;
        }

        (async () => {
            const { type, ...routeData } = route || {};
            const { id, identifier, uid, option_id, url_page } = routeData || {};
            const isEmpty = !id && !identifier && !uid && !option_id && !url_page;
            if (!type || isEmpty) {
                return;
            }

            try {
                const rootComponent = await getRootComponent(type);

                // Add data in seperate field to get initial filters
                if (type === 'SHOP_BY_ATTRIBUTE_OPTION') {
                    routeData.attributeSearch = routeData.relative_url;
                } else if (type === 'CATEGORY') {
                    routeData.attributeSearch = routeData.relative_url;
                }

                setComponent(pathname, {
                    component: rootComponent,
                    ...getComponentData(routeData),
                    type
                });
            } catch (error) {
                if (process.env.NODE_ENV !== 'production') {
                    console.error(error);
                }

                setComponent(pathname, error);
            }
        })();
    }, [route]); // eslint-disable-line react-hooks/exhaustive-deps

    const { id, identifier, uid, redirect_code, relative_url, option_id, type } = route || {};

    // Evaluate both results and determine the response type
    const empty = !route || !type || (!id && !identifier && !uid && !option_id);
    const redirect = isRedirect(redirect_code);
    const fetchError = component instanceof Error && component;
    const routeError = fetchError || error;
    const isInitialized = initialized.current || !getInlinedPageData();

    let showPageLoader = false;
    let routeData;

    if (component && !fetchError) {
        // FOUND
        routeData = component;
    } else if (routeError) {
        // ERROR
        routeData = { hasError: true, routeError };
    } else if (redirect) {
        // REDIRECT
        routeData = {
            isRedirect: true,
            relativeUrl: relative_url.startsWith('/') ? relative_url : '/' + relative_url
        };
    } else if (empty && fetchedPathname.current === pathname && !loading) {
        // NOT FOUND
        routeData = { isNotFound: true };
    } else if (nextRootComponent) {
        // LOADING with full page shimmer
        showPageLoader = true;
        routeData = { isLoading: true, shimmer: nextRootComponent };
    } else {
        // LOADING
        const isInitialLoad = !isInitialized;
        routeData = { isLoading: true, initial: isInitialLoad };
    }

    useEffect(() => {
        (async () => {
            const inlinedData = getInlinedPageData();
            if (inlinedData) {
                try {
                    const componentType = inlinedData.type;
                    const rootComponent = await getRootComponent(componentType);

                    // Add data in seperate field to get initial filters
                    if (componentType === 'SHOP_BY_ATTRIBUTE_OPTION') {
                        inlinedData.attributeSearch = inlinedData.relative_url;
                    } else if (componentType === 'CATEGORY') {
                        inlinedData.attributeSearch = inlinedData.relative_url;
                    }

                    setComponent(pathname, {
                        component: rootComponent,
                        type: componentType,
                        ...getComponentData(inlinedData)
                    });
                } catch (error) {
                    setComponent(pathname, error);
                }
            }
            initialized.current = true;
        })();

        return () => {
            // Unmount
            resetInlinedPageData();
        };
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    // Perform a redirect if necesssary
    useEffect(() => {
        if (routeData && routeData.isRedirect) {
            replace(routeData.relativeUrl);
        }
    }, [pathname, replace, routeData]);

    useEffect(() => {
        if (component) {
            // Reset loading shimmer whenever component resolves
            setNextRootComponent(null);
        }
    }, [component, pathname, setNextRootComponent]);

    useEffect(() => {
        setPageLoading(showPageLoader);
    }, [showPageLoader, setPageLoading]);

    return routeData;
};
