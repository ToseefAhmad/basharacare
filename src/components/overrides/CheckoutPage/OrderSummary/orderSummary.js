import React, { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';

import { Section } from '@app/components/overrides/Accordion';
import PriceAdjustments from '@app/components/overrides/CartPage/PriceAdjustments';
import PriceSummary from '@app/components/overrides/CartPage/PriceSummary/priceSummary';
import ProductListing from '@app/components/overrides/CartPage/ProductListing';
import { useProductListing } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './orderSummary.module.css';

const OrderSummary = ({ children, ...props }) => {
    const classes = useStyle(defaultClasses, props.classes);

    const { items } = useProductListing();

    const sectionClasses = {
        root: classes.sectionRoot,
        title_container: classes.sectionTitleContainer,
        title_wrapper: classes.sectionTitleWrapper,
        title: classes.sectionTitle,
        contents_container: classes.sectionContents
    };

    const iconClasses = { root: classes.iconRoot };

    const checkoutProductSection = (
        <Section
            iconClasses={iconClasses}
            classes={sectionClasses}
            id="shipping_method"
            data-cy="checkoutOrderSummary-productListing"
            title={
                <Suspense fallback={<LoadingIndicator />}>
                    <FormattedMessage
                        id="checkoutOrderSummary.productListing"
                        defaultMessage="You have  {items} {items, plural,
                            =0 {products}
                            one {product}
                            other {products}
                            
                        } in cart"
                        values={{ items: items.length }}
                    />
                </Suspense>
            }
        >
            <ProductListing
                shimmerCount={1}
                classes={{ root: classes.checkoutProductlistingRoot }}
                grandParentClasses={{
                    root: classes.productRoot,
                    item: classes.productItem,
                    item_disabled: classes.productItemUpdating,
                    actions: classes.productActions,
                    wishlist: classes.productWishlist
                }}
                setIsCartUpdating={props.setIsUpdating}
            />
        </Section>
    );

    return (
        <div data-cy="OrderSummary-root" className={classes.root}>
            <h4 className={classes.summaryTitle}>
                <FormattedMessage id="priceSummary.title" defaultMessage="Summary" />
            </h4>

            <PriceAdjustments checkoutProductListing={checkoutProductSection} setIsCartUpdating={props.setIsUpdating} />
            <PriceSummary isUpdating={props.isUpdating} />
            {children}
        </div>
    );
};

export default OrderSummary;
