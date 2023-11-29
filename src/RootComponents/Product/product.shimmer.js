import { string, shape } from 'prop-types';
import React, { Fragment } from 'react';

import defaultClasses from '@app/components/overrides/ProductFullDetail/productFullDetail.module.css';
import CarouselShimmer from '@app/components/overrides/ProductImageCarousel/carousel.shimmer';
import ProductTabsShimmer from '@app/components/ProductTabs/productTabs.shimmer';
import RatingsAndReviews from '@app/components/RatingsAndReviews';
import RelatedProductsShimmer from '@app/components/RelatedProducts/relatedProducts.shimmer';
import ViewedProductsShimmer from '@app/components/ViewedProducts/viewedProducts.shimmer';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { BreadcrumbShimmer } from '@magento/venia-ui/lib/components/Breadcrumbs';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const ProductShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <Fragment>
            <BreadcrumbShimmer />
            <div className={classes.centeredBlock}>
                <div className={classes.root}>
                    <section className={classes.imageCarouselShimmer}>
                        <CarouselShimmer />
                    </section>
                    <div className={classes.stickyInfo}>
                        <section className={classes.brand}>
                            <div className={classes.brandName}>
                                <Shimmer width={4} height={2} key="product-brand" />
                            </div>
                            <div className={classes.wishListMobile}>
                                <Shimmer width={2} height={2} key="wishlist-mobile" />
                            </div>
                            <div className={classes.shareButton}>
                                <Shimmer width={2} height={2} key="share-button" />
                            </div>
                        </section>
                        <section className={classes.title}>
                            <div className={classes.productName}>
                                <Shimmer width="80%" height={4} key="product-brand" />
                            </div>
                            <div className={classes.wishListDesktop}>
                                <Shimmer width={2} height={2} key="wishlist-desktop" />
                            </div>
                        </section>
                        <section className={classes.shortDescription}>
                            <Shimmer width="100%" height={2} key="product-short-description" />
                        </section>
                        <section className={classes.reviews}>
                            <Shimmer width="100%" height={2} key="product-reviews" />
                            <div className={classes.configData}>
                                <Shimmer width="100%" height={3} key="product-config-data" />
                            </div>
                        </section>
                        <section className={classes.price}>
                            <div className={classes.productPrice}>
                                <Shimmer width={6} height={2} key="product-price" />
                            </div>
                        </section>
                        <section className={classes.quantity}>
                            <Shimmer width="50%" height={2.5} key="quantity-title" />
                        </section>
                        <section className={classes.actionsDesktop}>
                            <Shimmer type="button" width="100%" height={3} key="add-to-cart" />
                        </section>
                    </div>
                    <section>
                        <div className={classes.actionsMobile}>
                            <Shimmer width="100%" height={2} type="button" key="product-actionsMobile" />
                        </div>
                    </section>
                    <section className={classes.description}>
                        <span className={classes.descriptionTitle}>
                            <Shimmer width={15} height={5} type="button" key="product-descriptionTile" />
                        </span>
                        <div className={classes.descriptionContent}>
                            <Shimmer width="100%" height={25} type="button" key="product-description-content" />
                        </div>
                    </section>
                    <section className={classes.tabs}>
                        <ProductTabsShimmer />
                    </section>
                </div>
            </div>
            <div className={classes.relatedProducts}>
                <RelatedProductsShimmer />
            </div>
            <div className={classes.viewedProducts}>
                <ViewedProductsShimmer />
            </div>
            <RatingsAndReviews />
        </Fragment>
    );
};

ProductShimmer.defaultProps = {
    classes: {}
};

ProductShimmer.propTypes = {
    productType: string.isRequired,
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
    })
};

export default ProductShimmer;
