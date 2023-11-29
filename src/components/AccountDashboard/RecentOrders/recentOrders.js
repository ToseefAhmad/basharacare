import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import OrderRow from '@app/components/overrides/OrderHistoryPage/orderRow.js';
import OrderHistoryContextProvider from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './recentOrders.module.css';

const RecentOrders = props => {
    const { orders, isLoadingWithoutData } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const orderRows = useMemo(() => {
        return orders.map(order => {
            return <OrderRow key={order.id} order={order} />;
        });
    }, [orders]);

    const pageContents = useMemo(() => {
        if (!isLoadingWithoutData && !orders.length) {
            return null;
        }
        if (isLoadingWithoutData) {
            return (
                <LoadingIndicator>
                    <FormattedMessage id="recentOrders.loadingText" defaultMessage="Loading your Orders" />
                </LoadingIndicator>
            );
        } else {
            return (
                <>
                    <div className={classes.tableHeader}>
                        <span>
                            <FormattedMessage id="recentOrders.OrderNumberLabel" defaultMessage="Order" />
                        </span>
                        <span>
                            <FormattedMessage id="recentOrders.DateLabel" defaultMessage="Date" />
                        </span>
                        <span>
                            <FormattedMessage id="recentOrders.ShipToLabel" defaultMessage="Ship To" />
                        </span>
                        <span>
                            <FormattedMessage id="recentOrders.OrderTotalLabel" defaultMessage="Order Total" />
                        </span>
                        <span>
                            <FormattedMessage id="recentOrders.StatusLabel" defaultMessage="Status" />
                        </span>
                        <span>
                            <FormattedMessage id="recentOrders.ActionLabel" defaultMessage="Action" />
                        </span>
                    </div>
                    <ul className={classes.orderHistoryTable}>{orderRows}</ul>
                </>
            );
        }
    }, [classes.orderHistoryTable, classes.tableHeader, isLoadingWithoutData, orderRows, orders.length]);

    if (!orders.length) {
        return null;
    }
    return (
        <OrderHistoryContextProvider>
            <div className={classes.root}>
                <div className={classes.title}>
                    <h2>
                        <FormattedMessage id="recentOrders.title" defaultMessage="Recent" />
                    </h2>
                    <h2>
                        <FormattedMessage id="recentOrders.secondary" defaultMessage="Orders" />
                    </h2>
                </div>
                {pageContents}
            </div>
        </OrderHistoryContextProvider>
    );
};

export default RecentOrders;
