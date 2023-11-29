import { useQuery, useMutation } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { REORDER_ITEMS } from '@app/components/overrides/OrderHistoryPage/reorderItems.gql';
import { ToastType, useToasts } from '@app/hooks/useToasts';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryPage.gql';
import { deriveErrorMessage } from '@magento/peregrine/lib/util/deriveErrorMessage';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const PAGE_SIZE = 10;

export const useOrderHistoryPage = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);

    const { orderNumber } = props || {};
    const { getCustomerOrdersQuery } = operations;
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();
    const { push } = useHistory();

    const [reorderItems] = useMutation(REORDER_ITEMS);

    const handleReorderItems = useCallback(async () => {
        try {
            await reorderItems({
                variables: {
                    orderNumber
                }
            });
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'orderRow.reorderSuccess',
                    defaultMessage: 'All the items are successfully added to cart'
                })
            });
            push('/cart');
        } catch (e) {
            addToast({
                type: ToastType.ERROR,
                message: e.message,
                timeout: 10000
            });
        }
    }, [addToast, formatMessage, orderNumber, push, reorderItems]);

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const [pageSize, setPageSize] = useState(PAGE_SIZE);
    const [searchText, setSearchText] = useState('');

    const { data: orderData, error: getOrderError, loading: orderLoading } = useQuery(getCustomerOrdersQuery, {
        fetchPolicy: 'cache-and-network',
        variables: {
            filter: {
                number: {
                    match: searchText
                }
            },
            pageSize
        }
    });

    const orders = orderData ? orderData.customer.orders.items : [];

    const isLoadingWithoutData = !orderData && orderLoading;
    const isBackgroundLoading = !!orderData && orderLoading;

    const pageInfo = useMemo(() => {
        if (orderData) {
            const { total_count } = orderData.customer.orders;

            return {
                current: pageSize < total_count ? pageSize : total_count,
                total: total_count
            };
        }

        return null;
    }, [orderData, pageSize]);

    const derivedErrorMessage = useMemo(() => deriveErrorMessage([getOrderError]), [getOrderError]);

    const handleReset = useCallback(() => {
        setSearchText('');
    }, []);

    const handleSubmit = useCallback(({ search }) => {
        setSearchText(search);
    }, []);

    const loadMoreOrders = useMemo(() => {
        if (orderData) {
            const { page_info } = orderData.customer.orders;
            const { current_page, total_pages } = page_info;

            if (current_page < total_pages) {
                return () => setPageSize(current => current + PAGE_SIZE);
            }
        }

        return null;
    }, [orderData]);

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    return {
        errorMessage: derivedErrorMessage,
        handleReset,
        handleSubmit,
        isBackgroundLoading,
        isLoadingWithoutData,
        loadMoreOrders,
        orders,
        pageInfo,
        searchText,
        handleReorderItems
    };
};
