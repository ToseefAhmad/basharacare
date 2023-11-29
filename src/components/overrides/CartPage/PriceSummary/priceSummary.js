import PayfortApplePay from '@magebit/pwa-studio-payfortFortCc/src/components/Methods/payfort_applepay';
import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';

import { Accordion, Section } from '@app/components/overrides/Accordion';
import { useRewardCodeContext } from '@app/components/RewardsAccount/RewardCode/context';
import StoreCreditForm from '@app/components/StoreCreditForm';
import TabbyPromo from '@app/components/TabbyPromo';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import { useStyle } from '@magento/venia-ui/lib/classify';
import DiscountSummary from '@magento/venia-ui/lib/components/CartPage/PriceSummary/discountSummary';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './priceSummary.module.css';
import ShippingSummary from './shippingSummary';
import { StoreCreditSummary } from './storeCreditSummary';
import TaxSummary from './taxSummary';

/**
 * A child component of the CartPage component.
 * This component fetches and renders cart data, such as subtotal, discounts applied,
 * gift cards applied, tax, shipping, and cart total.
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides.
 * See [priceSummary.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceSummary/priceSummary.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import PriceSummary from "@magento/venia-ui/lib/components/CartPage/PriceSummary";
 */
const PriceSummary = props => {
    const { isUpdating } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = usePriceSummary();

    const { hasError, hasItems, isCheckout, isLoading, flatData } = talonProps;
    const { formatMessage } = useIntl();
    const { subtotal, total, discounts, taxes, shipping, credit } = flatData;

    const [{ isSignedIn }] = useUserContext();

    const RewardSummary = () => {
        const talonProps = useRewardCodeContext();

        const { data } = talonProps;

        const appliedRewards = data?.cart?.applied_rewards || false;

        if (!appliedRewards) return null;
        const { spend, earn_points } = appliedRewards || {};

        return (
            <>
                <span className={classes.lineItemLabel}>
                    <FormattedMessage id="priceSummary.earnRewardLabel" defaultMessage="You earn" />
                </span>
                <span className={priceClass}>
                    {earn_points} <FormattedMessage id="priceSummary.earnRewardPoints" defaultMessage="Reward points" />
                </span>

                {spend ? (
                    <>
                        <span className={classes.lineItemLabel}>
                            <FormattedMessage id="priceSummary.spendRewardLabel" defaultMessage="You spend" />
                        </span>
                        <span className={priceClass}>
                            {spend}{' '}
                            <FormattedMessage id="priceSummary.earnRewardPoints" defaultMessage="Reward points" />
                        </span>
                    </>
                ) : null}
            </>
        );
    };

    if (hasError) {
        return (
            <div className={classes.root}>
                <span className={classes.errorText}>
                    <FormattedMessage
                        id="priceSummary.errorText"
                        defaultMessage="Something went wrong. Please refresh and try again."
                    />
                </span>
            </div>
        );
    } else if (!hasItems) {
        return null;
    }

    const isPriceUpdating = isUpdating || isLoading;
    const priceClass = isPriceUpdating ? classes.priceUpdating : classes.price;
    const isInCart = !isCheckout && !!total?.value;

    const totalPriceLabel = isCheckout
        ? formatMessage({
              id: 'priceSummary.total',
              defaultMessage: 'Total'
          })
        : formatMessage({
              id: 'priceSummary.orderTotal',
              defaultMessage: 'Order Total'
          });

    return (
        <div className={classes.root} data-cy="PriceSummary-root">
            <div className={classes.lineItems}>
                <span className={classes.lineItemLabel}>
                    <FormattedMessage id="priceSummary.lineItemLabel" defaultMessage="Subtotal" />
                </span>
                <span data-cy="PriceSummary-subtotalValue" className={priceClass}>
                    <Price value={subtotal.value} currencyCode={subtotal.currency} />
                </span>
                <DiscountSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={discounts}
                />
                <StoreCreditSummary
                    data={credit}
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    currencyCode={subtotal.currency}
                />
                <ShippingSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={shipping}
                    isCheckout={isCheckout}
                />
                <TaxSummary
                    classes={{
                        lineItemLabel: classes.lineItemLabel,
                        price: priceClass
                    }}
                    data={taxes}
                    isCheckout={isCheckout}
                />
                {isSignedIn ? <RewardSummary /> : null}
            </div>
            <div className={classes.orderTotalContainer}>
                <span className={classes.totalLabel}>{totalPriceLabel}</span>
                <span data-cy="PriceSummary-totalValue" className={classes.totalPrice}>
                    <Price value={total.value} currencyCode={total.currency} />
                </span>
            </div>
            {isInCart && (
                <>
                    <div className={classes.tabby}>
                        <TabbyPromo source="cart" price={total.value} currency={total.currency} />
                        <PayfortApplePay setIsCartUpdating={props.setIsCartUpdating} />
                    </div>
                </>
            )}
            {isSignedIn && (
                <Accordion noScrollIntoView classes={{ root: classes.accordionRoot }} canOpenMultiple={true}>
                    <Section
                        iconClasses={{ root: classes.iconRoot }}
                        classes={{
                            root: classes.sectionRoot,
                            title_container: classes.sectionTitleContainer,
                            title_wrapper: classes.sectionTitleWrapper,
                            title: classes.sectionTitle,
                            contents_container: classes.sectionContents
                        }}
                        id="store_credit"
                        data-cy="PriceSummary-storeCreditSection"
                        title={formatMessage({
                            id: 'priceSummary.storeCreditSectionTitle',
                            defaultMessage: 'Use Store Credit'
                        })}
                    >
                        <StoreCreditForm appliedAmount={credit?.amount?.value} />
                    </Section>
                </Accordion>
            )}
        </div>
    );
};

export default PriceSummary;
