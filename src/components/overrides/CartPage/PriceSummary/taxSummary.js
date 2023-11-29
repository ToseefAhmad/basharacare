import React from 'react';
import { useIntl } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';
/**
 * Reduces applied tax amounts into a single amount.
 *
 * @param {Array} applied_taxes
 */
const getEstimatedTax = (applied_taxes = []) => {
    return {
        currency: applied_taxes[0].amount.currency,
        value: applied_taxes.reduce((acc, tax) => acc + tax.amount.value, 0)
    };
};

/**
 * A component that renders the tax summary line item.
 *
 * @param {Object} props.classes
 * @param {Object} props.data query response data
 */
const TaxSummary = props => {
    const classes = useStyle({}, props.classes);
    const { data, isCheckout } = props;
    const { formatMessage } = useIntl();

    // Don't render estimated taxes until an address has been provided which
    if (!data.length) {
        return null;
    }

    const taxLabel = isCheckout
        ? formatMessage({
              id: 'taxSummary.tax',
              defaultMessage: 'Tax'
          })
        : formatMessage({
              id: 'taxSummary.VAT',
              defaultMessage: 'VAT'
          });

    const tax = getEstimatedTax(props.data);

    return (
        <>
            <span className={classes.lineItemLabel}>{taxLabel}</span>
            <span data-cy="TaxSummary-taxValue" className={classes.price}>
                <Price value={tax.value} currencyCode={tax.currency} />
            </span>
        </>
    );
};

export default TaxSummary;
