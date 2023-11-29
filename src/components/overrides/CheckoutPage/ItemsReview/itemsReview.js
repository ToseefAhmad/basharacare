import React, { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { useItemsReview } from '@magento/peregrine/lib/talons/CheckoutPage/ItemsReview/useItemsReview';
import { CHECKOUT_STEP } from '@magento/peregrine/lib/talons/CheckoutPage/useCheckoutPage';
import { useStyle } from '@magento/venia-ui/lib/classify';
import ShowAllButton from '@magento/venia-ui/lib/components/CheckoutPage/ItemsReview/showAllButton';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import Item from './item';
import defaultClasses from './itemsReview.module.css';

/**
 * Renders a list of items in an order.
 * @param {Object} props.data an optional static data object to render instead of making a query for data.
 */
const ItemsReview = props => {
    const { classes: propClasses, checkoutStep, scrollIntoView, anchorRef } = props;

    const classes = useStyle(defaultClasses, propClasses);

    const talonProps = useItemsReview({
        data: props.data
    });

    const {
        items: itemsInCart,
        totalQuantity,
        showAllItems,
        setShowAllItems,
        isLoading,
        configurableThumbnailSource
    } = talonProps;

    useEffect(() => {
        if (checkoutStep === CHECKOUT_STEP.REVIEW && !isLoading) {
            setTimeout(() => {
                scrollIntoView(anchorRef);
            }, 200);
        }
    }, [checkoutStep, scrollIntoView, isLoading, anchorRef]);

    const items = itemsInCart.map((item, index) => (
        <Item
            key={index}
            {...item}
            isHidden={!showAllItems && index >= 2}
            configurableThumbnailSource={configurableThumbnailSource}
        />
    ));

    const showAllItemsFooter = !showAllItems ? (
        <ShowAllButton
            classes={{ text: classes.showAllText, arrowDown: classes.showAllArrowDown }}
            onClick={setShowAllItems}
        />
    ) : null;

    if (isLoading) {
        return (
            <LoadingIndicator>
                <FormattedMessage
                    id="checkoutPage.fetchingItemsInYourOrder"
                    defaultMessage="Fetching Items in your Order"
                />
            </LoadingIndicator>
        );
    }

    return (
        <div className={classes.items_review_container} data-cy="ItemsReview-container">
            <div className={classes.items_container}>
                <div className={classes.total_quantity}>
                    <span className={classes.total_quantity_amount}>{totalQuantity}</span>
                    <FormattedMessage id="checkoutPage.itemsInYourOrder" defaultMessage=" items in your order" />
                </div>
                {items}
            </div>
            {showAllItemsFooter}
        </div>
    );
};

export default ItemsReview;
