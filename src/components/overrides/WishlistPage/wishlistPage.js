import React, { createContext, Fragment, useContext, useEffect } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import Pagination from '@app/components/overrides/Pagination/pagination';
import SharedWishlists from '@app/components/overrides/WishlistPage/SharedWishlists/sharedWishlists';
import WishlistPageShimmer from '@app/components/overrides/WishlistPage/wishlistPage.shimmer';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CreateWishlist from '@magento/venia-ui/lib/components/WishlistPage/createWishlist';

import { useWishlistPage } from './useWishlistPage';
import Wishlist from './wishlist';
import defaultClasses from './wishlistPage.module.css';

const SharedContext = createContext();
const { Provider: SharedWishlistsProvider } = SharedContext;

const WishlistPage = props => {
    const { wishlistId } = useParams();
    const talonProps = useWishlistPage({ wishlistId });
    const {
        errors,
        isSender,
        currentWishList,
        loading,
        handleShowShared,
        pageControl,
        handleUpdateWishlistItems,
        items,
        wishlistItemsLoading,
        sharedItems,
        id,
        currentWishlistId
    } = talonProps;

    const { items_count: itemsCount } = currentWishList;
    const { formatMessage } = useIntl();
    const error = errors.get('getCustomerWishlistQuery');

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [pageControl]);

    const classes = useStyle(defaultClasses, props.classes);
    const WISHLIST_DISABLED_MESSAGE = formatMessage({
        id: 'wishlistPage.wishlistDisabledMessage',
        defaultMessage: 'The wishlist is not currently available.'
    });

    const contextValue = {
        handleShowShared
    };
    const pagination = itemsCount ? <Pagination pageControl={pageControl} /> : '';
    const wishlistElement = (
        <SharedWishlistsProvider value={contextValue}>
            <Wishlist
                loading={loading}
                loadingItems={wishlistItemsLoading}
                data={currentWishList}
                isSender={isSender}
                sharedItems={sharedItems}
                updateItems={handleUpdateWishlistItems}
                items={items}
                id={id}
            />
            {pagination}
            {sharedItems.length ? (
                <SharedWishlists sharedItems={sharedItems} currentWishlistId={currentWishlistId} />
            ) : (
                ''
            )}
        </SharedWishlistsProvider>
    );

    let content;
    if (error) {
        const derivedErrorMessage = deriveErrorMessage([error]);
        const errorElement =
            derivedErrorMessage === WISHLIST_DISABLED_MESSAGE ? (
                <p>
                    <FormattedMessage
                        id="wishlistPage.disabledMessage"
                        defaultMessage="Sorry, this feature has been disabled."
                    />
                </p>
            ) : (
                <p className={classes.fetchError}>
                    <FormattedMessage
                        id="wishlistPage.fetchErrorMessage"
                        defaultMessage="Something went wrong. Please refresh and try again."
                    />
                </p>
            );

        content = <div className={classes.errorContainer}>{errorElement}</div>;
    }
    if ((loading && itemsCount) || wishlistItemsLoading) {
        content = <WishlistPageShimmer itemsCount={itemsCount} />;
    } else {
        content = (
            <Fragment>
                {wishlistElement}
                <CreateWishlist />
            </Fragment>
        );
    }

    return (
        <AccountPageWrapper>
            <div className={classes.root} data-cy="Wishlist-root">
                {content}
            </div>
        </AccountPageWrapper>
    );
};

export default WishlistPage;

export const useSharedContext = () => useContext(SharedContext);
