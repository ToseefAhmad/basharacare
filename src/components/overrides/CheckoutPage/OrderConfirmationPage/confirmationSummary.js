import React from 'react';
import { FormattedMessage } from 'react-intl';

import ShippingSummary from '@app/components/overrides/CartPage/PriceSummary/shippingSummary';
import TaxSummary from '@app/components/overrides/CartPage/PriceSummary/taxSummary';
import { useStyle } from '@magento/venia-ui/lib/classify';
import DiscountSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/discountSummary';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './confirmationSummary.module.css';
import { useConfirmationSummary } from './useConfirmationSummary';

const ConfirmationSummary = ({ data, ...props }) => {
    const { summaryData } = useConfirmationSummary({ data });
    const classes = useStyle(defaultClasses, props.classes);

    const { subtotal, total, discounts, taxes, shipping } = summaryData;

    const totalPriceLabel = <FormattedMessage id="orderSummary.Total" defaultMessage="TOTAL" />;

    return (
        <div className={classes.root} data-cy="orderSummary-root">
            <div className={classes.summaryHeading}>
                <FormattedMessage id="orderSummary.summary" defaultMessage="Summary of your order" />
            </div>
            <div className={classes.lineItems}>
                <span className={classes.lineItemLabel}>
                    <FormattedMessage id="orderSummary.lineItemLabel" defaultMessage="Subtotal" />
                </span>
                <span data-cy="orderSummary-subtotalValue" className={classes.price}>
                    <Price value={subtotal.value} currencyCode={subtotal.currency} />
                </span>
                <DiscountSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={discounts}
                />

                <TaxSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={taxes}
                    isCheckout
                />
                <ShippingSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: classes.price
                    }}
                    data={shipping}
                    isCheckout
                />
                <span className={classes.totalLabel}>{totalPriceLabel}</span>
                <span data-cy="orderSummary-totalValue" className={classes.totalPrice}>
                    <Price value={total.value} currencyCode={total.currency} />
                </span>
            </div>
        </div>
    );
};

export default ConfirmationSummary;
