import { useQuery, useLazyQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo } from 'react';

import { useWindowSize } from '@magento/peregrine';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';

import { GET_CUSTOMER_WISHLIST, GET_CUSTOMER_WISHLIST_ITEMS } from './wishlist.gql';

/**
 * @function
 *
 * @returns {WishlistPageProps}
 */
export const useWishlistPage = ({ wishlistId }) => {
    const [{ isSignedIn }] = useUserContext();
    const { innerWidth } = useWindowSize();
    const isTablet = innerWidth < 1024 && innerWidth > 768;

    const { data, error, loading } = useQuery(GET_CUSTOMER_WISHLIST, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        skip: !isSignedIn
    });

    const derivedWishlists = useMemo(() => {
        return (data && data.customer.wishlists) || [];
    }, [data]);

    const currentWishList = useMemo(() => {
        return data?.customer?.wishlists[0] || [];
    }, [data]);

    const isSender = useMemo(() => {
        return (data && data.customer.is_sender) || false;
    }, [data]);

    const currentWishlistId = currentWishList?.id;

    const errors = useMemo(() => {
        return new Map([['getCustomerWishlistQuery', error]]);
    }, [error]);

    const id = useMemo(() => {
        return wishlistId ? wishlistId : currentWishList?.id;
    }, [currentWishList?.id, wishlistId]);

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const [getWishlistItems, { data: wishlistItemsData, loading: wishlistItemsLoading }] = useLazyQuery(
        GET_CUSTOMER_WISHLIST_ITEMS,
        {
            fetchPolicy: 'no-cache',
            variables: {
                id
            }
        }
    );

    useEffect(() => {
        const totalPagesFromData = wishlistItemsData?.customer?.wishlist_v2?.items_v2?.page_info?.total_pages;

        setTotalPages(totalPagesFromData);

        return () => {
            setTotalPages(null);
        };
    }, [data, setTotalPages, wishlistItemsData]);

    const items = useMemo(() => {
        return wishlistItemsData?.customer?.wishlist_v2?.items_v2?.items || [];
    }, [wishlistItemsData]);

    const sharedItems = useMemo(() => {
        return wishlistItemsData?.customer?.shared_items || [];
    }, [wishlistItemsData?.customer?.shared_items]);

    const handleUpdateWishlistItems = useCallback(() => {
        getWishlistItems({
            variables: {
                id,
                currentPage,
                pageSize: isTablet ? 9 : 8
            }
        });
    }, [currentPage, getWishlistItems, id, isTablet]);

    useEffect(() => {
        handleUpdateWishlistItems();
    }, [currentPage, getWishlistItems, handleUpdateWishlistItems, id, isTablet]);

    const handleShowShared = useCallback(
        id => {
            setCurrentPage(1, true);
            getWishlistItems({
                variables: {
                    id,
                    currentPage,
                    pageSize: isTablet ? 9 : 8
                }
            });
        },
        [currentPage, getWishlistItems, isTablet, setCurrentPage]
    );

    return {
        errors,
        loading,
        shouldRenderVisibilityToggle: derivedWishlists.length > 1,
        wishlists: derivedWishlists,
        isSender,
        currentWishList,
        handleShowShared,
        pageControl,
        handleUpdateWishlistItems,
        items,
        wishlistItemsLoading,
        sharedItems,
        id,
        currentWishlistId
    };
};

/**
 * JSDoc type definitions
 */

/**
 * GraphQL mutations for the Wishlist Page
 *
 * @typedef {Object} WishlistQueries
 *
 * @property {GraphQLDocument} getCustomerWishlistQuery Query to get customer wish lists
 *
 * @see [`wishlistPage.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/WishlistPage/wishlistPage.gql.js}
 * for queries used in Venia
 */

/**
 * GraphQL types for the Wishlist Page
 *
 * @typedef {Object} WishlistTypes
 *
 * @property {Function} Customer.fields.wishlists.read
 *
 * @see [`wishlistPage.gql.js`]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/WishlistPage/wishlistPage.gql.js}
 * for queries used in Venia
 */

/**
 * Props data to use when rendering the Wishlist Item component
 *
 * @typedef {Object} WishlistPageProps
 *
 * @property {Map} errors A map of all the GQL query errors
 * @property {Boolean} loading is the query loading
 * @property {Boolean} shouldRenderVisibilityToggle true if wishlists length is > 1.
 * @property {Object} wishlists List of all customer wishlists
 */
