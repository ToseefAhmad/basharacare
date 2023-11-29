import React, { Suspense } from 'react';
import { Route, Switch, useLocation } from 'react-router-dom';

import MainLayout from '@app/layouts/MainLayout';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';
import MagentoRoute from '@magento/venia-ui/lib/components/MagentoRoute';

const Routes = () => {
    const { pathname } = useLocation();
    useScrollTopOnChange(pathname);

    return (
        <Suspense fallback={fullPageLoadingIndicator}>
            <Switch>
                {/*
                 * Client-side routes are injected by BabelRouteInjectionPlugin here.
                 * Venia's are defined in packages/venia-ui/lib/targets/venia-ui-intercept.js
                 */}
                <Route>
                    <MainLayout>
                        <MagentoRoute />
                        {/*
                         * The Route below is purposefully nested with the MagentoRoute above.
                         * MagentoRoute renders the CMS page, and HomePage adds a stylesheet.
                         * HomePage would be obsolete if the CMS could deliver a stylesheet.
                         */}
                    </MainLayout>
                </Route>
            </Switch>
        </Suspense>
    );
};

export default Routes;
const availableRoutes = [];
export { availableRoutes };
