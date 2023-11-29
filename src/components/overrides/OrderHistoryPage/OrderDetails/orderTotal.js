import { arrayOf, string, shape, number } from 'prop-types';
import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './orderTotal.module.css';

const OrderTotal = props => {
    const { classes: propClasses, data } = props;
    const { discounts, grand_total, subtotal, total_tax, total_shipping } = data;
    const classes = useStyle(defaultClasses, propClasses);

    const discountRowElement = useMemo(() => {
        if (!discounts || !discounts.length) {
            return null;
        }

        const discountTotal = {
            currency: discounts[0].amount.currency,
            value: discounts.reduce((acc, discount) => acc + discount.amount.value, 0)
        };

        return (
            <div className={classes.discount}>
                <span>
                    <FormattedMessage id="orderDetails.discount" defaultMessage="Discount" />
                </span>
                <span>
                    <Price value={discountTotal.value} currencyCode={discountTotal.currency} />
                </span>
            </div>
        );
    }, [classes.discount, discounts]);

    return (
        <div className={classes.root}>
            <div className={classes.subTotal}>
                <span>
                    <FormattedMessage id="orderDetails.subtotal" defaultMessage="Subtotal" />
                </span>
                <span>
                    <Price value={subtotal.value} currencyCode={subtotal.currency} />
                </span>
            </div>
            <div className={classes.shipping}>
                <span>
                    <FormattedMessage id="orderDetails.shippingHandling" defaultMessage="Shipping & Handling" />
                </span>
                <span>
                    <Price value={total_shipping.value} currencyCode={total_shipping.currency} />
                </span>
            </div>
            {discountRowElement}
            <div className={classes.tax}>
                <span>
                    <FormattedMessage id="orderDetails.vat" defaultMessage="VAT" />
                </span>
                <span>
                    <Price value={total_tax.value} currencyCode={total_tax.currency} />
                </span>
            </div>

            <div className={classes.total}>
                <span>
                    <FormattedMessage id="orderDetails.grandTotal" defaultMessage="Grand Total" />
                </span>
                <span>
                    <Price value={grand_total.value} currencyCode={grand_total.currency} />
                </span>
            </div>
        </div>
    );
};

export default OrderTotal;

OrderTotal.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        subTotal: string,
        discount: string,
        tax: string,
        shipping: string,
        total: string
    }),
    data: shape({
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
};
