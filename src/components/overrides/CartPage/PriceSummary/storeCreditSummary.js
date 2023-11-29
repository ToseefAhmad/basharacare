import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import Price from '@app/components/overrides/Price';
import { useStyle } from '@magento/venia-ui/lib/classify';

export const StoreCreditSummary = ({ data, currencyCode, classes: propClasses }) => {
    const classes = useStyle({}, propClasses);

    const price = useMemo(() => {
        if (data?.amount?.value && currencyCode) {
            return <Price value={data?.amount?.value} currencyCode={currencyCode} />;
        }
    }, [data, currencyCode]);

    if (!price) {
        return null;
    }

    return (
        <>
            <span className={classes.lineItemLabel}>
                <FormattedMessage defaultMessage="Store Credit" id="storeCreditSummary.label" />
            </span>
            <span data-cy="ShippingSummary-shippingValue" className={classes.price}>
                -{price}
            </span>
        </>
    );
};
