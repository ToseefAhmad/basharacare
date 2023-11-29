import classNames from 'classnames';
import React, { useEffect, Suspense, useRef } from 'react';
import { Check } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
const FormattedMessageDynamic = FormattedMessage;

import FreeSamples from '@app/components/FreeSamples/freeSamples';
import { useFreeSamples } from '@app/components/FreeSamples/useFreeSamples';
import { Section } from '@app/components/overrides/Accordion';
import Button from '@app/components/overrides/Button';
import DEFAULT_OPERATIONS from '@app/components/overrides/CartPage/cartPage.gql';
import PriceAdjustments from '@app/components/overrides/CartPage/PriceAdjustments';
import PriceSummary from '@app/components/overrides/CartPage/PriceSummary';
import ProductListing from '@app/components/overrides/CartPage/ProductListing';
import RewardCodeProvider from '@app/components/RewardsAccount/RewardCode/context';
import RewardMessage from '@app/components/RewardsAccount/RewardCode/rewardMessage';
import { useAppContext } from '@app/context/App';
import { useElementVisibility } from '@app/hooks/useElementVisibility';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useShippingMethods } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/useShippingMethods';
import { usePriceSummary } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/usePriceSummary';
import { useCartPage } from '@magento/peregrine/lib/talons/CartPage/useCartPage';
import { useToasts } from '@magento/peregrine/lib/Toasts/useToasts';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@magento/venia-ui/lib/components/CartPage/cartPage.module.css';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator/indicator';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import StockStatusMessage from '@magento/venia-ui/lib/components/StockStatusMessage';

import ShippingForm from './PriceAdjustments/ShippingMethods/shippingForm';

const ShippingMethods = React.lazy(() => import('@app/components/overrides/CartPage/PriceAdjustments/ShippingMethods'));

const CheckIcon = <Icon size={20} src={Check} />;

/**
 * Structural page component for the shopping cart.
 * This is the main component used in the `/cart` route in Venia.
 * It uses child components to render the different pieces of the cart page.
 *
 * @see {@link https://venia.magento.com/cart}
 *
 * @param {Object} props
 * @param {Object} props.classes CSS className overrides for the component.
 * See [cartPage.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/cartPage.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import CartPage from "@magento/venia-ui/lib/components/CartPage";
 */
const CartPage = props => {
    const {
        cartItems,
        hasItems,
        isCartUpdating,
        fetchCartDetails,
        onAddToWishlistSuccess,
        setIsCartUpdating,
        wishlistSuccessProps
    } = useCartPage({ operations: DEFAULT_OPERATIONS });

    const { hasMethods, selectedShippingFields } = useShippingMethods();
    const [{ isSigningIn, isRestoringCart }] = useAppContext();

    const [{ isSignedIn }] = useUserContext();

    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const { isCheckout, isLoading, handleProceedToCheckout } = usePriceSummary();

    const checkoutMobile = useRef(null);

    const { isVisible: isButtonVisible } = useElementVisibility({ element: checkoutMobile.current });
    const { isVisible: isFooterVisible } = useElementVisibility({ element: document.querySelector('#footer') });
    const { isOnlySampleProductInCart } = useFreeSamples();
    useEffect(() => {
        if (wishlistSuccessProps) {
            addToast({ ...wishlistSuccessProps, icon: CheckIcon });
        }
    }, [addToast, wishlistSuccessProps]);

    let productListing;

    if (hasItems || isSigningIn || isRestoringCart) {
        productListing = (
            <ProductListing
                shimmerCount={3}
                onAddToWishlistSuccess={onAddToWishlistSuccess}
                setIsCartUpdating={setIsCartUpdating}
                fetchCartDetails={fetchCartDetails}
            />
        );
    } else if (!hasItems && isCartUpdating) {
        productListing = <Shimmer classes={{ root_rectangle: classes.shimmerSummary }} width="100%" />;
    } else {
        productListing = (
            <h3>
                <FormattedMessage id="cartPage.emptyCart" defaultMessage="There are no items in your cart." />
            </h3>
        );
    }

    const sectionClasses = {
        root: classes.sectionRoot,
        title_container: classes.sectionTitleContainer,
        title_wrapper: classes.sectionTitleWrapper,
        title: classes.sectionTitle,
        contents_container: classes.sectionContents
    };

    const iconClasses = { root: classes.iconRoot };

    const shippingCountryDropdown = (
        <ShippingForm
            hasMethods={hasMethods}
            selectedShippingFields={selectedShippingFields}
            setIsCartUpdating={setIsCartUpdating}
        />
    );

    const shippingSection = (
        <Section
            iconClasses={iconClasses}
            classes={sectionClasses}
            id="shipping_method"
            data-cy="PriceAdjustments-shippingMethodSection"
            title={formatMessage({
                id: 'priceAdjustments.shippingAndTax',
                defaultMessage: 'Estimate Shipping and Tax'
            })}
        >
            <Suspense fallback={<LoadingIndicator />}>
                <ShippingMethods setIsCartUpdating={setIsCartUpdating}>{shippingCountryDropdown}</ShippingMethods>
            </Suspense>
        </Section>
    );

    const priceAdjustments = hasItems ? (
        <PriceAdjustments setIsCartUpdating={setIsCartUpdating}>{shippingSection}</PriceAdjustments>
    ) : null;

    const priceSummary = hasItems ? (
        <PriceSummary setIsCartUpdating={setIsCartUpdating} isUpdating={isCartUpdating || isSigningIn} />
    ) : null;

    const itemHeaderLabels = ['Item', 'Price', 'Qty', 'Subtotal'];

    const isPriceUpdating = isCartUpdating || isLoading || isSigningIn;

    const proceedToCheckoutButton = !isCheckout ? (
        <div className={classes.checkoutButton_container}>
            <Button
                disabled={isPriceUpdating || isOnlySampleProductInCart}
                priority="high"
                onClick={handleProceedToCheckout}
                data-cy="PriceSummary-checkoutButton"
            >
                <FormattedMessage id="priceSummary.checkoutBtn" defaultMessage="Checkout" />
            </Button>
        </div>
    ) : null;

    const rewardMessage =
        isSignedIn && hasItems ? (
            <div className={classes.rewardMessageContainer}>
                <RewardMessage />
            </div>
        ) : null;

    return (
        <RewardCodeProvider setIsCartUpdating={setIsCartUpdating}>
            <div className={classes.root} data-cy="CartPage-root">
                <StoreTitle>
                    {formatMessage({
                        id: 'cartPage.title',
                        defaultMessage: 'Cart'
                    })}
                </StoreTitle>
                <div className={classes.heading_container}>
                    <h1 className={classes.heading}>
                        <FormattedMessage id="cartPage.heading" defaultMessage="Cart" />
                    </h1>
                    <div className={classes.stockStatusMessageContainer}>
                        <StockStatusMessage cartItems={cartItems} />
                    </div>
                </div>
                <div className={classes.body}>
                    <div className={classes.sampleContainer}>
                        {isCartUpdating || isSigningIn ? (
                            <Shimmer classes={{ root_rectangle: classes.samplesShimmer }} width="100%" />
                        ) : (
                            hasItems && <FreeSamples />
                        )}
                    </div>
                    <div className={classes.items_container}>
                        <div className={classes.rewardMessageDesktop}>{rewardMessage}</div>

                        {hasItems && (
                            <div className={classes.itemHeader}>
                                {itemHeaderLabels.map(label => {
                                    return (
                                        <span key={label}>
                                            <FormattedMessageDynamic
                                                id={`productListing.${label}`}
                                                defaultMessage={label}
                                            />
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                        {productListing}
                    </div>
                    {hasItems && (
                        <div className={classes.summaryContainer}>
                            <div className={classes.rewardMessageMobile}>{rewardMessage}</div>
                            <div className={classes.summary}>
                                <h4 className={classes.summaryTitle}>
                                    <FormattedMessage id="priceSummary.title" defaultMessage="Summary" />
                                </h4>
                                <div className={classes.price_adjustments_container}>{priceAdjustments}</div>

                                {isPriceUpdating ? (
                                    <>
                                        <Shimmer classes={{ root_rectangle: classes.shimmerSummary }} width="100%" />
                                        <Shimmer classes={{ root_rectangle: classes.shimmerTotal }} width="100%" />
                                        <Shimmer classes={{ root_rectangle: classes.shimmerCheckout }} width="100%" />
                                    </>
                                ) : (
                                    <>
                                        <div className={classes.summary_contents}>{priceSummary}</div>
                                        <div className={classes.checkoutButtonDesktop}> {proceedToCheckoutButton}</div>
                                    </>
                                )}
                            </div>
                        </div>
                    )}

                    {isPriceUpdating ? (
                        <Shimmer classes={{ root_rectangle: classes.shimmerCheckoutButtonMobile }} width="100%" />
                    ) : (
                        <div
                            ref={checkoutMobile}
                            className={classNames(classes.checkoutButtonMobile, {
                                [classes.checkoutButtonMobilePadding]: !isButtonVisible && !isFooterVisible
                            })}
                        >
                            <div
                                className={
                                    !isButtonVisible && !isFooterVisible ? classes.checkoutButtonMobileFixed : null
                                }
                            >
                                {proceedToCheckoutButton}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </RewardCodeProvider>
    );
};

export default CartPage;
