import { shape, string } from 'prop-types';
import React, { Fragment } from 'react';
import { Search } from 'react-feather';
import { useIntl } from 'react-intl';

import MegaMenu from '../MegaMenu';
import PageLoadingIndicator from '../PageLoadingIndicator';

import logo from '@app/components/overrides/Logo/logo.svg';
import SearchBox from '@app/components/SearchBox';
import { useAppContext } from '@app/context/App';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';
import { useStyle } from '@magento/venia-ui/lib/classify';
import OnlineIndicator from '@magento/venia-ui/lib/components/Header/onlineIndicator';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Link from '@magento/venia-ui/lib/components/Link';

import AccountTrigger from './accountTrigger';
import CartTrigger from './cartTrigger';
import defaultClasses from './header.module.css';
import NavTrigger from './navTrigger';
import StoreSwitcher from './storeSwitcher';
import { useHeader } from './useHeader';
import WhishlistTrigger from './wishlistTrigger';

const Header = props => {
    const { classes: propClasses } = props;
    const { hasBeenOffline, isOnline } = useHeader();
    const [, { setIsSearchOpen }] = useAppContext();
    const classes = useStyle(defaultClasses, propClasses);
    const { formatMessage } = useIntl();
    const { innerWidth } = useWindowSize();

    const isMobile = innerWidth < 1024;

    return (
        <Fragment>
            <header id="header" className={classes.root} data-cy="Header-root">
                <div className={classes.toolbar}>
                    {isMobile && (
                        <div className={classes.primaryActions}>
                            <NavTrigger />
                        </div>
                    )}
                    <OnlineIndicator hasBeenOffline={hasBeenOffline} isOnline={isOnline} />
                    <Link to="/" className={classes.logoContainer}>
                        <img className={classes.logo} src={logo} alt="logo" />
                    </Link>
                    {!isMobile && <MegaMenu />}
                    <div className={classes.secondaryActions}>
                        {!isMobile && (
                            <>
                                <div className={classes.search}>
                                    <SearchBox
                                        classes={{
                                            root: classes.searchBoxRoot,
                                            input: classes.searchBoxInput,
                                            icon: classes.searchBoxIcon,
                                            resetIcon: classes.searchBoxReset
                                        }}
                                        canReset={true}
                                    />
                                </div>
                                <div className={classes.switchers}>
                                    <StoreSwitcher />
                                </div>
                                <AccountTrigger />
                                <WhishlistTrigger />
                            </>
                        )}
                        <CartTrigger />
                    </div>
                </div>
                <PageLoadingIndicator absolute />
            </header>
            {isMobile && (
                <div
                    className={`${classes.mobileSearch} ${
                        window.location.pathname.includes('checkout') ? 'hidden' : ''
                    }`}
                >
                    <SearchBox
                        allowSearchPage={true}
                        onSubmit={() => {
                            setIsSearchOpen(true);
                        }}
                        onReset={() => {
                            setIsSearchOpen(false);
                        }}
                        placeholder={formatMessage({
                            id: 'global.defaultSearchText',
                            defaultMessage: 'Try our new search'
                        })}
                        classes={{
                            root: classes.mobileSearchRoot,
                            input: classes.mobileSearchInput,
                            icon: classes.hidden,
                            resetIcon: classes.mobileResetIcon
                        }}
                        canReset={true}
                    />
                    <Icon
                        src={Search}
                        size={16}
                        classes={{
                            root: classes.mobileSearchIcon
                        }}
                    />
                </div>
            )}
        </Fragment>
    );
};

Header.propTypes = {
    classes: shape({
        closed: string,
        logo: string,
        open: string,
        primaryActions: string,
        secondaryActions: string,
        toolbar: string,
        switchers: string,
        switchersContainer: string
    })
};

export default Header;
