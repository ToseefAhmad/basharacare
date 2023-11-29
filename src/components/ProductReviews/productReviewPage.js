import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import ProductReviews from '@app/components/ProductReviews/productReviews';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

import classes from './productReviewPage.module.css';

const ProductReviewPage = () => {
    const { formatMessage } = useIntl();

    return (
        <AccountPageWrapper pageTitle="My Product">
            <StoreTitle>
                {formatMessage({
                    id: 'accountInformationPage.titleAccount',
                    defaultMessage: 'Account Information'
                })}
            </StoreTitle>
            <div className={classes.title}>
                <h2>
                    <FormattedMessage id="reviewsPage.Title" defaultMessage="My Product" />
                </h2>
                <h2>
                    <FormattedMessage id="reviewsPage.Secondary" defaultMessage="Reviews" />
                </h2>
            </div>
            <ProductReviews />
        </AccountPageWrapper>
    );
};

export default ProductReviewPage;
