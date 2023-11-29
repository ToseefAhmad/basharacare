import { string, number, shape, object } from 'prop-types';
import React from 'react';
import { Info } from 'react-feather';
import { Highlight } from 'react-instantsearch-dom';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import AmProductLabels from '@app/components/ProductLabels';
import ProductReviewsSummary from '@app/components/ReviewProduct/ProductReviewsSummary';
import { UNCONSTRAINED_SIZE_KEY } from '@magento/peregrine/lib/talons/Image/useImage';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';

import AddToCartButton from './addToCartButton';
import defaultClasses from './item.module.css';
import GalleryItemShimmer from './item.shimmer';
import { useGalleryItem } from './useGalleryItem';

// The placeholder image is 4:5, so we should make sure to size our product
// Images appropriately.
const IMAGE_WIDTH = 150;
const IMAGE_HEIGHT = 150;
const IMAGE_RATIO = 1;

// Gallery switches from two columns to three at 640px.
const IMAGE_WIDTHS = new Map().set(640, IMAGE_WIDTH).set(UNCONSTRAINED_SIZE_KEY, 840);

const GalleryItem = props => {
    const { handleLinkClick, item, isSupportedProductType, wishlistButtonProps } = useGalleryItem(props);

    const { storeConfig, hit } = props;

    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    const classes = useStyle(defaultClasses, props.classes);

    if (!item) {
        return <GalleryItemShimmer classes={classes} />;
    }

    const { name, price_range, small_image, url_key, rating_summary, review_count, brand_name, brand_url } = item;

    const review = {
        rating_summary: item.rating_summary ? rating_summary : null,
        review_count: item.review_count ? review_count : null
    };

    const { url: smallImageURL } = small_image;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);

    const addButton = isSupportedProductType ? (
        <AddToCartButton item={item} algoliaQueryId={hit?.__queryID} urlSuffix={productUrlSuffix} />
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id="galleryItem.unavailableProduct"
                    defaultMessage="Currently unavailable for purchase."
                />
            </p>
        </div>
    );

    // Hide the Rating component until it is updated with the new look and feel (PWA-2512).

    const wishlistButton = wishlistButtonProps ? (
        <WishlistGalleryButton
            classes={{ root: classes.wishlistRoot, root_selected: classes.wishlistRootSelected }}
            {...wishlistButtonProps}
        />
    ) : null;

    const finalPrice = price_range.maximum_price.final_price.value;
    const regularPrice = price_range.maximum_price.regular_price.value;

    const discountedPrice = (
        <div className={classes.discountedPrice}>
            {regularPrice > finalPrice && (
                <Price value={regularPrice} currencyCode={price_range.maximum_price.regular_price.currency} />
            )}
        </div>
    );

    return (
        <div className={classes.root}>
            <div className={classes.cardContent} aria-live="polite" aria-busy="false">
                <div className={classes.wishlistButtonContainer}> {wishlistButton}</div>
                <Link onClick={handleLinkClick} to={productLink} className={classes.images}>
                    <AmProductLabels mode="CATEGORY" itemId={item.id} productWidth={100} />
                    <Image
                        alt={name}
                        classes={{
                            image: classes.image,
                            loaded: classes.imageLoaded,
                            notLoaded: classes.imageNotLoaded,
                            root: classes.imageContainer
                        }}
                        height={IMAGE_HEIGHT}
                        width={IMAGE_WIDTH}
                        ratio={IMAGE_RATIO}
                        resource={smallImageURL}
                        widths={IMAGE_WIDTHS}
                    />
                </Link>
                <div className={classes.namePriceContainer}>
                    {brand_url && (
                        <Link className={classes.brandName} to={brand_url}>
                            {brand_name}
                        </Link>
                    )}
                    <Link
                        onClick={handleLinkClick}
                        to={productLink}
                        className={classes.name}
                        data-cy="GalleryItem-name"
                    >
                        <span>{hit ? <Highlight hit={hit} attribute="name" /> : name}</span>
                    </Link>
                    <div className={classes.priceContainer}>
                        <div className={classes.price}>
                            <Price value={finalPrice} currencyCode={price_range.maximum_price.final_price.currency} />
                        </div>
                        {discountedPrice}
                    </div>
                </div>
                <div className={classes.reviewContainer}>
                    <ProductReviewsSummary
                        classes={{ root: classes.reviewRoot, reviewLink: classes.reviewLink }}
                        reviewClick={handleLinkClick}
                        reviewPath={productLink + '#reviews'}
                        height={10}
                        width={10}
                        review={review}
                    />
                </div>
            </div>
            <div className={classes.actionsContainer}>{addButton}</div>
        </div>
    );
};

GalleryItem.propTypes = {
    classes: shape({
        image: string,
        imageLoaded: string,
        imageNotLoaded: string,
        imageContainer: string,
        images: string,
        name: string,
        price: string,
        root: string
    }),
    hit: object,
    item: shape({
        id: number.isRequired,
        uid: string,
        name: string.isRequired,
        small_image: shape({
            url: string.isRequired
        }),
        stock_status: string.isRequired,
        __typename: string.isRequired,
        url_key: string.isRequired,
        sku: string.isRequired,
        price_range: shape({
            maximum_price: shape({
                regular_price: shape({
                    value: number.isRequired,
                    currency: string.isRequired
                }).isRequired
            }).isRequired
        }).isRequired
    }),
    storeConfig: shape({
        magento_wishlist_general_is_enabled: string.isRequired,
        product_url_suffix: string
    })
};

export default GalleryItem;
