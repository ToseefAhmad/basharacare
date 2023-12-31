import { arrayOf, number, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import ReorderButton from '@app/components/overrides/OrderHistoryPage/reorderButton';
import { useOrderRow } from '@magento/peregrine/lib/talons/OrderHistoryPage/useOrderRow';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

import OrderDetails from './OrderDetails';
import defaultClasses from './orderRow.module.css';

const OrderRow = props => {
    const { order } = props;
    const { formatMessage } = useIntl();
    const {
        invoices,
        items,
        number: orderNumber,
        order_date: orderDate,
        shipments,
        status,
        total,
        shipping_address
    } = order;

    const { firstname, middlename, lastname } = shipping_address;

    const formattedShipTo = [firstname, middlename, lastname].filter(name => !!name).join(' ');
    const { grand_total: grandTotal } = total;
    const { currency, value: orderTotal } = grandTotal;

    // Convert date to ISO-8601 format so Safari can also parse it
    const isoFormattedDate = orderDate.replace(' ', 'T');
    const formattedDate = new Date(isoFormattedDate).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });

    const hasInvoice = !!invoices.length;
    const hasShipment = !!shipments.length;
    let derivedStatus;
    if (status === 'Complete') {
        derivedStatus = formatMessage({
            id: 'orderRow.deliveredText',
            defaultMessage: 'Delivered'
        });
    } else if (hasShipment) {
        derivedStatus = formatMessage({
            id: 'orderRow.shippedText',
            defaultMessage: 'Shipped'
        });
    } else if (hasInvoice) {
        derivedStatus = formatMessage({
            id: 'orderRow.readyToShipText',
            defaultMessage: 'Ready to ship'
        });
    } else {
        derivedStatus = formatMessage({
            id: 'orderRow.processingText',
            defaultMessage: 'Processing'
        });
    }

    const talonProps = useOrderRow({ items });
    const { loading, isOpen, handleContentToggle, imagesData } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const contentClass = isOpen ? classes.content : classes.content_collapsed;

    const rootClass = isOpen ? classes.root_expanded : classes.root;

    const collapseButtonText = !isOpen ? (
        <FormattedMessage id="orderRow.viewOrderButtonText" defaultMessage="View Order" />
    ) : (
        <FormattedMessage id="orderRow.hideOrderButtonText" defaultMessage="Hide Order" />
    );

    const orderDetails = loading ? null : <OrderDetails orderData={order} imagesData={imagesData} />;

    const orderTotalPrice =
        currency && orderTotal !== null ? <Price currencyCode={currency} value={orderTotal} /> : '-';

    return (
        <li className={rootClass}>
            <div className={classes.orderNumberContainer}>
                <span className={classes.orderNumberLabel}>
                    <FormattedMessage id="orderRow.orderIdText" defaultMessage="Order" />
                </span>
                <span className={classes.orderNumber}>{orderNumber}</span>
            </div>
            <div className={classes.orderDateContainer}>
                <span className={classes.orderDateLabel}>
                    <FormattedMessage id="orderRow.orderDateText" defaultMessage="Order Date" />
                </span>
                <span className={classes.orderDate}>{formattedDate}</span>
            </div>
            <div className={classes.orderShipToContainer}>
                <span className={classes.orderShipToLabel}>
                    <FormattedMessage id="orderRow.orderShipToText" defaultMessage="Ship to" />
                </span>
                <span className={classes.shipTo}>{formattedShipTo}</span>
            </div>
            <div className={classes.orderTotalContainer}>
                <span className={classes.orderTotalLabel}>
                    <FormattedMessage id="orderRow.orderTotalText" defaultMessage="Order Total" />
                </span>
                <div className={classes.orderTotal}>{orderTotalPrice}</div>
            </div>
            <div className={classes.orderStatusContainer}>
                <span className={classes.orderStatusLabel}>
                    <FormattedMessage id="orderRow.orderStatusText" defaultMessage="Status" />
                </span>
                <span className={classes.orderStatusBadge}>{derivedStatus}</span>
            </div>
            <div className={classes.orderActionContainer}>
                <span className={classes.orderActionLabel}>
                    <FormattedMessage id="orderRow.orderActionText" defaultMessage="Action" />
                </span>
                <div className={classes.actionButtons}>
                    <button className={classes.contentToggleContainer} onClick={handleContentToggle} type="button">
                        {collapseButtonText}
                    </button>
                    <ReorderButton orderNumber={orderNumber} />
                </div>
            </div>
            <div className={contentClass}>{orderDetails}</div>
        </li>
    );
};

export default OrderRow;

OrderRow.propTypes = {
    classes: shape({
        root: string,
        cell: string,
        stackedCell: string,
        label: string,
        value: string,
        orderNumberContainer: string,
        orderDateContainer: string,
        orderTotalContainer: string,
        orderStatusContainer: string,
        orderItemsContainer: string,
        contentToggleContainer: string,
        orderNumberLabel: string,
        orderDateLabel: string,
        orderTotalLabel: string,
        orderNumber: string,
        orderDate: string,
        orderTotal: string,
        orderStatusBadge: string,
        content: string,
        content_collapsed: string
    }),
    order: shape({
        billing_address: shape({
            city: string,
            country_code: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            street: arrayOf(string)
        }),
        items: arrayOf(
            shape({
                id: string,
                product_name: string,
                product_sale_price: shape({
                    currency: string,
                    value: number
                }),
                product_sku: string,
                selected_options: arrayOf(
                    shape({
                        label: string,
                        value: string
                    })
                ),
                quantity_ordered: number
            })
        ),
        invoices: arrayOf(
            shape({
                id: string
            })
        ),
        number: string,
        order_date: string,
        payment_methods: arrayOf(
            shape({
                type: string,
                additional_data: arrayOf(
                    shape({
                        name: string,
                        value: string
                    })
                )
            })
        ),
        shipping_address: shape({
            city: string,
            country_code: string,
            firstname: string,
            lastname: string,
            postcode: string,
            region_id: string,
            street: arrayOf(string),
            telephone: string
        }),
        shipping_method: string,
        shipments: arrayOf(
            shape({
                id: string,
                tracking: arrayOf(
                    shape({
                        number: string
                    })
                )
            })
        ),
        status: string,
        total: shape({
            discounts: arrayOf(
                shape({
                    amount: shape({
                        currency: string,
                        value: number
                    })
                })
            ),
            grand_total: shape({
                currency: string,
                value: number
            }),
            subtotal: shape({
                currency: string,
                value: number
            }),
            total_tax: shape({
                currency: string,
                value: number
            }),
            total_shipping: shape({
                currency: string,
                value: number
            })
        })
    })
};
