import { Form } from 'informed';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import React, { Suspense, useRef, useEffect } from 'react';
import { Info } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import AmastyFaqQuestions from '@app/components/AmastyFaqQuestions';
import { Box } from '@app/components/Icons';
import Breadcrumbs from '@app/components/overrides/Breadcrumbs';
import { useProductFullDetail } from '@app/components/overrides/ProductFullDetail/useProductFullDetail';
import Carousel from '@app/components/overrides/ProductImageCarousel';
import AmProductLabelProvider from '@app/components/ProductLabels/context';
import ProductTabs from '@app/components/ProductTabs';
import RatingsAndReviews from '@app/components/RatingsAndReviews';
import RelatedProducts from '@app/components/RelatedProducts';
import ProductReviewsSummary from '@app/components/ReviewProduct/ProductReviewsSummary';
import ShareDropdown from '@app/components/ShareDropdown';
import TabbyPromo from '@app/components/TabbyPromo';
import ViewedProducts from '@app/components/ViewedProducts';
import { useElementVisibility } from '@app/hooks/useElementVisibility';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button';
import { QuantityFields } from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';
import FormError from '@magento/venia-ui/lib/components/FormError';
import Price from '@magento/venia-ui/lib/components/Price';
import CustomAttributes from '@magento/venia-ui/lib/components/ProductFullDetail/CustomAttributes';
import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';

import defaultClasses from './productFullDetail.module.css';
import defaultOperations from './productFullDetailExtend.gql';

const WishlistButton = React.lazy(() => import('@magento/venia-ui/lib/components/Wishlist/AddToListButton'));
const Options = React.lazy(() => import('@magento/venia-ui/lib/components/ProductOptions'));

// Correlate a GQL error message to a field. GQL could return a longer error
// String, but it may contain contextual info such as product id. We can use
// Parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const ProductFullDetail = props => {
    const { product, viewedProducts, productTabs } = props;
    const operations = defaultOperations;

    const talonProps = useProductFullDetail({ product, operations });

    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isAddToCartDisabled,
        isSupportedProductType,
        mediaGalleryEntries,
        productDetails,
        customAttributes,
        wishlistButtonProps,
        deliveryData,
        productsFromVariants
    } = talonProps;

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <Options onSelectionChange={handleSelectionChange} options={product.configurable_options} />
        </Suspense>
    ) : null;

    const breadcrumbs = (
        <Breadcrumbs
            classes={{
                breadcrumbContainer: classes.breadcrumbsContainer,
                root: classes.breadcrumbsRoot,
                breadcrumbShimmerRoot: classes.breadcrumbShimmerRoot
            }}
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
        />
    );

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        /* Handle cases where a user token is invalid or expired. Preferably
         this would be handled elsewhere with an error code and not a string. */
        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        // Handle cases where a cart wasn't created properly.
        if (errorMessage.includes('Variable "$cartId" got invalid value null')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage: 'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    const cartCallToActionText = !isOutOfStock ? (
        <FormattedMessage id="productFullDetail.addItemToCart" defaultMessage="Add to Cart" />
    ) : (
        <FormattedMessage id="productFullDetail.itemOutOfStock" defaultMessage="Out of Stock" />
    );

    const cartActionContent = isSupportedProductType ? (
        <Button
            data-cy="ProductFullDetail-addToCartButton"
            disabled={isAddToCartDisabled}
            priority="cart"
            fullWidth
            type="submit"
        >
            {cartCallToActionText}
        </Button>
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id="productFullDetail.unavailableProduct"
                    defaultMessage="This product is currently unavailable for purchase."
                />
            </p>
        </div>
    );

    const generalTab = {
        id: 'general',
        title: 'General Info',
        content: <CustomAttributes customAttributes={customAttributes} />
    };

    const tabsData = productTabs ? [generalTab, ...productTabs.getProductTabs] : [generalTab];

    const addToCartMobileFixed = useRef(null);
    const { isVisible: isButtonVisible } = useElementVisibility({ element: addToCartMobileFixed.current });
    const { isVisible: isNewsLetterVisible } = useElementVisibility({ element: document.querySelector('#newsletter') });
    const { isVisible: isFooterVisible } = useElementVisibility({ element: document.querySelector('#footer') });

    const reviewsOnClickRef = useRef(null);

    const scrollEffect = (targetRef, behavior) => {
        targetRef.current.scrollIntoView({
            behavior: behavior,
            block: 'start'
        });
    };

    const currentPathname = window.location.href;

    useEffect(() => {
        if (currentPathname.includes('#reviews')) {
            setTimeout(() => {
                scrollEffect(reviewsOnClickRef, 'auto');
            }, 0);
        }
    }, [currentPathname]);

    const { is_visible, error_message, delivery_time } = deliveryData || {};

    const deliveryMessage = deliveryData && error_message ? error_message : delivery_time;
    const deliverySection =
        deliveryData && is_visible ? (
            <section className={classes.deliveryInfo}>
                <div className={classes.boxIcon}>
                    <Box />
                </div>
                {deliveryMessage}
            </section>
        ) : null;

    const finalPrice = productDetails.priceRange.maximum_price.final_price;
    const regularPrice = productDetails.priceRange.maximum_price.regular_price;

    const discountedPrice = (
        <div className={classes.discountedPrice}>
            {regularPrice.value > finalPrice.value && (
                <Price
                    classes={{ currency: classes.productPriceCurrency }}
                    value={regularPrice.value}
                    currencyCode={regularPrice.currency}
                />
            )}
        </div>
    );

    return (
        <AmProductLabelProvider products={product} mode="PRODUCT" productsFromVariants={productsFromVariants}>
            {breadcrumbs}

            <div className={classes.root}>
                <section className={classes.imageCarousel}>
                    <Carousel
                        classes={{ carouselContainer: classes.carouselContainer }}
                        images={mediaGalleryEntries}
                        id={product.id}
                    />
                </section>

                <Form data-cy="ProductFullDetail-root" className={classes.stickyInfo} onSubmit={handleAddToCart}>
                    <FormError
                        classes={{
                            root: classes.formErrors
                        }}
                        errors={errors.get('form') || []}
                    />
                    <div>
                        <section className={classes.brand}>
                            <Link className={classes.brandName} to={productDetails.brand_url}>
                                {productDetails.brand}
                            </Link>
                            <div className={classes.productActionContainer}>
                                <div className={classes.shareButton}>
                                    <ShareDropdown />
                                </div>
                                <div className={classes.wishListMobile}>
                                    <Suspense fallback={null}>
                                        <WishlistButton {...wishlistButtonProps} />
                                    </Suspense>
                                </div>
                            </div>
                        </section>
                        <section className={classes.title}>
                            <h1 data-cy="ProductFullDetail-productName">{productDetails.name}</h1>
                            <div className={classes.wishListDesktop}>
                                <Suspense fallback={null}>
                                    <WishlistButton {...wishlistButtonProps} />
                                </Suspense>
                            </div>
                        </section>
                        {productDetails.shortDescription ? (
                            <section className={classes.shortDescription}>
                                <h3>
                                    <RichContent html={productDetails.shortDescription} />
                                </h3>
                            </section>
                        ) : null}
                        {productDetails.review && productDetails.review.rating_summary ? (
                            <section className={classes.reviews}>
                                <div
                                    role="button"
                                    tabIndex={0}
                                    onClick={() => scrollEffect(reviewsOnClickRef, 'smooth')}
                                    onKeyDown={() => scrollEffect(reviewsOnClickRef, 'smooth')}
                                >
                                    <ProductReviewsSummary reviewPath="#" review={productDetails.review} />
                                </div>
                            </section>
                        ) : null}
                        {deliverySection}
                        <section>
                            <div className={classes.priceContainer}>
                                <div className={classes.price}>
                                    <Price
                                        classes={{ currency: classes.productPriceCurrency }}
                                        currencyCode={finalPrice.currency}
                                        value={finalPrice.value}
                                    />
                                </div>
                                {discountedPrice}
                            </div>
                            <div className={classes.includingVatText}>
                                <FormattedMessage id="productFullDetail.includingVat" defaultMessage="including VAT" />
                            </div>
                        </section>
                        <div className={classes.tabby}>
                            <TabbyPromo price={finalPrice.value} currency={finalPrice.currency} source="product" />
                        </div>
                        <section className={classes.options}>{options}</section>

                        <section className={classes.quantity}>
                            <QuantityFields
                                classes={{ root: classes.quantityRoot }}
                                message={errors.get('quantity')}
                                min={1}
                            />
                        </section>
                        <section className={classes.actionsDesktop}>{cartActionContent}</section>
                    </div>
                    <section>
                        <div className={classes.actionsMobile} ref={addToCartMobileFixed}>
                            {cartActionContent}
                        </div>
                    </section>
                    <section>
                        <div
                            className={
                                isButtonVisible || isNewsLetterVisible || isFooterVisible
                                    ? classes.actionsMobileFixedHidden
                                    : classes.actionsMobileFixed
                            }
                        >
                            {cartActionContent}
                        </div>
                    </section>
                </Form>
                <section className={classes.description}>
                    <span className={classes.descriptionTitle}>
                        <FormattedMessage id="productFullDetail.details" defaultMessage="Details" />
                    </span>
                    <RichContent html={productDetails.description} classes={{ root: classes.descriptionContent }} />
                </section>
                <section className={classes.faqQuestions}>
                    <AmastyFaqQuestions productId={product?.id} productUrlKey={product?.url_key} />
                </section>
                <section className={classes.tabs}>
                    <ProductTabs data={tabsData} />
                </section>
            </div>
            <div className={classes.relatedProducts}>
                {productDetails.relatedProducts && <RelatedProducts products={productDetails.relatedProducts} />}
            </div>
            <div className={classes.viewedProducts}>
                {viewedProducts && <ViewedProducts products={viewedProducts} />}
            </div>
            <div ref={reviewsOnClickRef} id="reviews" className={classes.reviewsContainer}>
                <RatingsAndReviews name={productDetails.name} sku={product.sku} pageSize={5} />
            </div>
        </AmProductLabelProvider>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        root: string,
        title: string,
        unavailableContainer: string
    }),
    product: shape({
        __typename: string,
        id: number,
        stock_status: string,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                uid: string,
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string
    }).isRequired
};

export default ProductFullDetail;
