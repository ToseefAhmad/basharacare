import { func } from 'prop-types';
import React, { Suspense } from 'react';
import { useIntl } from 'react-intl';

import { Accordion, Section } from '@app/components/overrides/Accordion';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import CouponCode from './CouponCode';
import defaultClasses from './priceAdjustments.module.css';

const RewardCode = React.lazy(() => import('@app/components/RewardsAccount/RewardCode'));

/**
 * PriceAdjustments is a child component of the CartPage component.
 * It renders the price adjustments forms for applying gift cards, coupons, and the shipping method.
 * All of which can adjust the cart total.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating A callback function for setting the updating state of the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [priceAdjustments.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/PriceAdjustments/priceAdjustments.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import PriceAdjustments from '@magento/venia-ui/lib/components/CartPage/PriceAdjustments'
 */
const PriceAdjustments = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { setIsCartUpdating, children } = props;
    const { formatMessage } = useIntl();
    const [{ isSignedIn }] = useUserContext();

    const sectionClasses = {
        root: classes.sectionRoot,
        title_container: classes.sectionTitleContainer,
        title_wrapper: classes.sectionTitleWrapper,
        title: classes.sectionTitle,
        contents_container: classes.sectionContents
    };

    const iconClasses = { root: classes.iconRoot };

    const rewardCode = isSignedIn ? (
        <Section
            iconClasses={iconClasses}
            classes={sectionClasses}
            id="reward_code"
            data-cy="PriceAdjustments-rewardCodeSection"
            title={formatMessage({
                id: 'priceAdjustments.rewardCode',
                defaultMessage: 'Use Reward Points'
            })}
        >
            <Suspense fallback={<LoadingIndicator />}>
                <RewardCode setIsCartUpdating={setIsCartUpdating} />
            </Suspense>
        </Section>
    ) : null;

    return (
        <div className={classes.root} data-cy="PriceAdjustments-root">
            <Accordion noScrollIntoView classes={{ root: classes.accordionRoot }} canOpenMultiple={true}>
                {props.checkoutProductListing}
                {rewardCode}
                {children}
                <Section
                    isOpen
                    iconClasses={iconClasses}
                    classes={sectionClasses}
                    id="coupon_code"
                    data-cy="PriceAdjustments-couponCodeSection"
                    title={formatMessage({
                        id: 'priceAdjustments.couponCode',
                        defaultMessage: 'Enter Coupon Code'
                    })}
                >
                    <Suspense fallback={<LoadingIndicator />}>
                        <CouponCode setIsCartUpdating={setIsCartUpdating} />
                    </Suspense>
                </Section>
            </Accordion>
        </div>
    );
};

export default PriceAdjustments;

PriceAdjustments.propTypes = {
    setIsCartUpdating: func
};
