import { useQuery, useLazyQuery, useMutation } from '@apollo/client';
import { convertFromHTML } from 'draft-js';
import { useCallback, useEffect, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import DEFAULT_OPERATIONS_WISHLIST from '@app/components/overrides/WishlistPage/wishlist.gql';
import { Directions, getDirection } from '@app/hooks/useDirection';
import { useTracking } from '@app/hooks/useTracking';
import { useToasts } from '@magento/peregrine';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';
import { BrowserPersistence } from '@magento/peregrine/lib/util';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import DEFAULT_OPERATIONS from './personalizadRoutine.gql.js';

const storage = new BrowserPersistence();

/**
 *
 * @param props
 * @returns {{isLoading: boolean, morningMessage: (*|string), nightMessage: (*|string), isLoadingWishlist: false | boolean, generalComment: (*|string), sharingCode: (*|string), complementaryProducts: (*|string), couponCode: (*|string), items: (*|*[])}}
 */
export const usePersonalizedRoutine = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, DEFAULT_OPERATIONS_WISHLIST, props.operations);
    storage.setItem('personalized-routine', true);

    const { trackInitiatesPersonalRoutine } = useTracking();
    trackInitiatesPersonalRoutine({});

    const {
        getCustomerRoutineQuery,
        getWishlistsBySharingCodeQuery,
        addAllProductToCartQuery,
        getCustomerSurveyItemsQuery
    } = operations;
    const [{ cartId }] = useCartContext();
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const { push } = useHistory();

    const isRtlDirection = getDirection() === Directions.rtl;

    const [addAllProductToCart, { loading: isAddingItemsToCart }] = useMutation(addAllProductToCartQuery, {
        fetchPolicy: 'no-cache'
    });

    const { data: routineQuery, loading: isLoading } = useQuery(getCustomerRoutineQuery, {
        fetchPolicy: 'cache-and-network'
    });

    const [runQuery, { data: wishlist, loading: isLoadingWishlist }] = useLazyQuery(getWishlistsBySharingCodeQuery, {
        fetchPolicy: 'no-cache'
    });

    const [runQuerySurveyItems, { data: surveyData, loading: isLoadingSurveyData }] = useLazyQuery(
        getCustomerSurveyItemsQuery,
        {
            fetchPolicy: 'no-cache'
        }
    );

    const [isUpdateList, setIsUpdateList] = useState(false);

    const sharingCode = routineQuery?.getCustomerRoutine?.sharing_code || null;
    const isSender = routineQuery?.customer?.is_sender || null;

    const handleAddAllProduct = useCallback(async () => {
        await addAllProductToCart({
            variables: {
                sharingCode,
                cartId
            }
        });
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'wishlist.addedAllSuccess',
                defaultMessage: 'All the items are successfully added to cart'
            })
        });
        push('/cart');
    }, [addAllProductToCart, addToast, cartId, formatMessage, push, sharingCode]);

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const handleSetUpdateList = useCallback(() => {
        setIsUpdateList(true);
    }, [setIsUpdateList]);

    useEffect(() => {
        const totalPagesFromData = isSender
            ? surveyData?.customer?.survey_items?.page_info?.total_pages
            : wishlist?.getWishlistsBySharingCode?.items_v2?.page_info?.total_pages;

        setTotalPages(totalPagesFromData);

        return () => {
            setTotalPages(null);
        };
    }, [
        isSender,
        setTotalPages,
        surveyData?.customer?.survey_items?.page_info?.total_pages,
        wishlist?.getWishlistsBySharingCode?.items_v2?.page_info?.total_pages
    ]);

    useEffect(() => {
        if (isSender || isUpdateList) {
            runQuerySurveyItems({
                variables: {
                    currentPage: Number(currentPage),
                    pageSize: 20
                }
            });
            setIsUpdateList(false);
        } else if (!isLoading && sharingCode) {
            runQuery({
                variables: {
                    sharingCode,
                    currentPage: Number(currentPage),
                    pageSize: 8
                }
            });
        }
    }, [currentPage, isLoading, isSender, isUpdateList, routineQuery, runQuery, runQuerySurveyItems, sharingCode]);

    const {
        sharing_code,
        general_comment,
        complementary_products,
        coupon_code,
        morning_message,
        night_message,
        morning_message_ar,
        night_message_ar,
        cms_top_advisor,
        cms_bottom_advisor
    } = routineQuery?.getCustomerRoutine || {};
    const { survey_items } = routineQuery?.customer || {};
    const { items } = wishlist?.getWishlistsBySharingCode?.items_v2 || {};
    const { items: surveyItems } = surveyData?.customer?.survey_items || {};
    const responses = survey_items?.items || [];

    const morningMessage = isRtlDirection ? morning_message_ar : morning_message;
    const nightMessage = isRtlDirection ? night_message_ar : night_message;

    const isMorningBlock = morningMessage ? convertFromHTML(morningMessage).contentBlocks.length : false;
    const isNightBlock = nightMessage ? convertFromHTML(nightMessage).contentBlocks.length : false;

    const isEmpty = !isMorningBlock && !isNightBlock && !items;

    return {
        isLoading,
        isLoadingWishlist,
        isAddingItemsToCart,
        isRtlDirection,
        sharingCode: sharing_code || '',
        generalComment: general_comment || '',
        complementaryProducts: complementary_products || '',
        couponCode: coupon_code || '',
        morningMessage: morningMessage || null,
        nightMessage: nightMessage || null,
        items: items || [],
        cmsTopAdvisor: cms_top_advisor || null,
        cmsBottomAdvisor: cms_bottom_advisor || null,
        handleAddAllProduct,
        pageControl,
        isSender,
        responses,
        surveyItems: surveyItems || [],
        isLoadingSurveyData,
        handleSetUpdateList,
        isMorningBlock,
        isNightBlock,
        isEmpty
    };
};
