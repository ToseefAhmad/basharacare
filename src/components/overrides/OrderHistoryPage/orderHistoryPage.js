import { shape, string } from 'prop-types';
import React, { useMemo, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import Button from '@app/components/overrides/Button';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useToasts } from '@magento/peregrine/lib/Toasts';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './orderHistoryPage.module.css';
import OrderRow from './orderRow';
import { useOrderHistoryPage } from './useOrderHistoryPage';

const OrderHistoryPage = props => {
    const talonProps = useOrderHistoryPage();
    const { errorMessage, loadMoreOrders, isBackgroundLoading, isLoadingWithoutData, orders, searchText } = talonProps;
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();
    const PAGE_TITLE = formatMessage({
        id: 'orderHistoryPage.pageTitleText',
        defaultMessage: 'Order History'
    });
    const classes = useStyle(defaultClasses, props.classes);

    const orderRows = useMemo(() => {
        return orders.map(order => {
            return <OrderRow key={order.id} order={order} />;
        });
    }, [orders]);

    const pageContents = useMemo(() => {
        if (isLoadingWithoutData) {
            return <LoadingIndicator />;
        } else if (!isBackgroundLoading && searchText && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id="orderHistoryPage.invalidOrderNumber"
                        defaultMessage={`Order "${searchText}" was not found.`}
                        values={{
                            number: searchText
                        }}
                    />
                </h3>
            );
        } else if (!isBackgroundLoading && !orders.length) {
            return (
                <h3 className={classes.emptyHistoryMessage}>
                    <FormattedMessage
                        id="orderHistoryPage.emptyDataMessage"
                        defaultMessage={"You don't have any orders yet."}
                    />
                </h3>
            );
        } else {
            return (
                <>
                    <div className={classes.tableHeader}>
                        <span>
                            <FormattedMessage id="orderHistoryPage.OrderLabel" defaultMessage="Order" />
                        </span>
                        <span>
                            <FormattedMessage id="orderHistoryPage.DateLabel" defaultMessage="Date" />
                        </span>
                        <span>
                            <FormattedMessage id="orderHistoryPage.ShipToLabel" defaultMessage="Ship To" />
                        </span>
                        <span>
                            <FormattedMessage id="orderHistoryPage.OrderTotalLabel" defaultMessage="Order Total" />
                        </span>
                        <span>
                            <FormattedMessage id="orderHistoryPage.StatusLabel" defaultMessage="Status" />
                        </span>
                        <span>
                            <FormattedMessage id="orderHistoryPage.ActionLabel" defaultMessage="Action" />
                        </span>
                    </div>
                    <ul className={classes.orderHistoryTable} data-cy="OrderHistoryPage-orderHistoryTable">
                        {orderRows}
                    </ul>
                </>
            );
        }
    }, [
        classes.emptyHistoryMessage,
        classes.orderHistoryTable,
        classes.tableHeader,
        isBackgroundLoading,
        isLoadingWithoutData,
        orderRows,
        orders.length,
        searchText
    ]);

    const loadMoreButton = loadMoreOrders ? (
        <Button
            classes={{ root_lowPriority: classes.loadMoreButton }}
            disabled={isBackgroundLoading || isLoadingWithoutData}
            onClick={loadMoreOrders}
            priority="low"
        >
            <FormattedMessage id="orderHistoryPage.loadMore" defaultMessage="Load More" />
        </Button>
    ) : null;

    useEffect(() => {
        if (errorMessage) {
            addToast({
                type: 'error',
                message: errorMessage,
                dismissable: true,
                timeout: 10000
            });
        }
    }, [addToast, errorMessage]);

    return (
        <AccountPageWrapper>
            <OrderHistoryContextProvider>
                <div className={classes.root}>
                    <StoreTitle>{PAGE_TITLE}</StoreTitle>
                    <div className={classes.title} data-cy="AccountInformationPage-title">
                        <h2>
                            <FormattedMessage id="accountInformationPage.orderHistoryTitle" defaultMessage="My" />
                        </h2>
                        <h2>
                            <FormattedMessage
                                id="accountInformationPage.orderHistorySecondary"
                                defaultMessage="Orders"
                            />
                        </h2>
                    </div>
                    {pageContents}
                    {loadMoreButton}
                </div>
            </OrderHistoryContextProvider>
        </AccountPageWrapper>
    );
};

export default OrderHistoryPage;

OrderHistoryPage.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        emptyHistoryMessage: string,
        orderHistoryTable: string,
        search: string,
        searchButton: string,
        submitIcon: string,
        loadMoreButton: string
    })
};
