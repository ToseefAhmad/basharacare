import classNames from 'classnames';
import { bool, shape, string } from 'prop-types';
import React, { Suspense, useMemo } from 'react';

import Newsletter from '@app/components/overrides/Newsletter';
import PromotionalBar from '@app/components/PromotionalBar/promotionalBar';
import { useAppContext } from '@app/context/App';
import { useScrollLock } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Footer from '@magento/venia-ui/lib/components/Footer';
import Header from '@magento/venia-ui/lib/components/Header';
import { fullPageLoadingIndicator } from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './main.module.css';

const Search = React.lazy(() => import(/* WebpackChunkName: "search" */ '@app/components/Search'));

const Main = props => {
    const { children, isMasked } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const [{ isSearchOpen, isPageFullWidth }] = useAppContext();
    useScrollLock(isMasked);

    const header = useMemo(() => <Header />, []);
    const newsletter = useMemo(() => <Newsletter />, []);
    const footer = useMemo(() => <Footer />, []);
    const promotionalBar = useMemo(() => <PromotionalBar />, []);

    return (
        <main
            className={classNames({
                [classes.root_masked]: isMasked,
                [classes.root]: !isMasked
            })}
        >
            {header}
            {promotionalBar}
            <div
                id="main"
                className={classNames({
                    [classes.page_masked]: isMasked,
                    [classes.page]: !isMasked,
                    [classes.fullWidth]: isPageFullWidth
                })}
            >
                {isSearchOpen ? (
                    <Suspense fallback={fullPageLoadingIndicator}>
                        <Search />
                    </Suspense>
                ) : (
                    children
                )}
            </div>
            {newsletter}
            {footer}
        </main>
    );
};

export default Main;

Main.propTypes = {
    classes: shape({
        page: string,
        page_masked: string,
        root: string,
        root_masked: string
    }),
    isMasked: bool
};
