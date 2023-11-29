import { arrayOf, number, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import BillingInformation from './billingInformation';
import Items from './items';
import defaultClasses from './orderDetails.module.css';
import OrderTotal from './orderTotal';
import PaymentMethod from './paymentMethod';
import ShippingInformation from './shippingInformation';
import ShippingMethod from './shippingMethod';

const ConditionalWrapper = props => (props.condition ? props.children : null);

const OrderDetails = props => {
    const { classes: propClasses, imagesData, orderData } = props;
    const { billing_address, items, payment_methods, shipping_address, shipping_method, shipments, total } = orderData;
    const classes = useStyle(defaultClasses, propClasses);

    const shippingMethodData = {
        shippingMethod: shipping_method,
        shipments
    };

    const hasTotals = total.grand_total && total.grand_total.currency;

    return (
        <div className={classes.root}>
            <div className={classes.itemsContainer}>
                <ConditionalWrapper condition={items && items.length}>
                    <Items data={{ imagesData, items }} />
                </ConditionalWrapper>
            </div>
            <div className={classes.orderTotalContainer}>
                <ConditionalWrapper condition={hasTotals}>
                    <OrderTotal data={total} />
                </ConditionalWrapper>
            </div>
            <div className={classes.orderInformationFooter}>
                <div className={classes.orderInformationTitle} data-cy="OrderDetails-ShippingInformation-title">
                    <h2>
                        <FormattedMessage id="orderDetails.orderInformationTitle" defaultMessage="Order" />
                    </h2>
                    <h2>
                        <FormattedMessage id="orderDetails.orderInformationSecondary" defaultMessage="Information" />
                    </h2>
                </div>
                <div className={classes.shippingInformationContainer}>
                    <ConditionalWrapper condition={shipping_address}>
                        <ShippingInformation data={shipping_address} />
                    </ConditionalWrapper>
                </div>
                <div className={classes.shippingMethodContainer}>
                    <ConditionalWrapper condition={shipping_method}>
                        <ShippingMethod data={shippingMethodData} />
                    </ConditionalWrapper>
                </div>
                <div className={classes.billingInformationContainer}>
                    <ConditionalWrapper condition={billing_address}>
                        <BillingInformation data={billing_address} />
                    </ConditionalWrapper>
                </div>
                <div className={classes.paymentMethodContainer}>
                    <ConditionalWrapper condition={payment_methods && payment_methods.length}>
                        <PaymentMethod data={payment_methods} />
                    </ConditionalWrapper>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;

OrderDetails.propTypes = {
    classes: shape({
        root: string,
        shippingInformationContainer: string,
        shippingMethodContainer: string,
        billingInformationContainer: string,
        paymentMethodContainer: string,
        itemsContainer: string,
        orderTotalContainer: string,
        printButton: string,
        printLabel: string
    }),
    orderData: shape({
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
                        carrier: string,
                        number: string
                    })
                )
            })
        ),
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
