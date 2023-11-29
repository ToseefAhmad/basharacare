import classNames from 'classnames';
import React from 'react';
import { Link } from 'react-router-dom';

import AmProductLabels from '@app/components/ProductLabels/productLabels';
import ProductReviewsSummary from '@app/components/ReviewProduct/ProductReviewsSummary';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './galleryItem.module.css';
import GalleryItemShimmer from './galleryItem.shimmer';
import { useGalleryItem } from './useGalleryItem';

const IMAGE_WIDTH = 100;
const IMAGE_HEIGHT = 100;
const IMAGE_RATIO = 1;

const GalleryItem = ({ product: item, onItemClick, classes: propClasses, storeConfig, isBlog }) => {
    const classes = useStyle(defaultClasses, propClasses);

    const { handleLinkClick, item: product } = useGalleryItem({ storeConfig, item, onItemClick });

    const reviewBlock =
        product.review_count === 0 ? (
            <div className={classes.emptyReview} />
        ) : (
            <ProductReviewsSummary
                width={12}
                review={{ review_count: product.review_count, rating_summary: product.rating_summary }}
                classes={{ reviewLink: classes.review, reviewsRating: classes.rating }}
            />
        );

    const productUrlSuffix = storeConfig && storeConfig.product_url_suffix;

    if (!product) {
        return <GalleryItemShimmer classes={classes} />;
    }

    const { name, media_gallery_entries, small_image, price_range, url_key, brand_name, brand_url } = product;
    const { url: smallImageURL } = small_image;
    const productLink = resourceUrl(`/${url_key}${productUrlSuffix || ''}`);

    const finalPrice = price_range.maximum_price.final_price.value;
    const regularPrice = price_range.maximum_price.regular_price.value;

    const discountedPrice = (
        <div className={classes.discountedPrice}>
            {regularPrice > finalPrice && (
                <Price value={regularPrice} currencyCode={price_range.maximum_price.regular_price.currency} />
            )}
        </div>
    );

    const mediaLabel =
        media_gallery_entries && media_gallery_entries.length > 0 && media_gallery_entries[0].label !== null
            ? media_gallery_entries[0].label
            : 'small Image';

    let image;
    if (smallImageURL) {
        image = (
            <Image
                alt={mediaLabel}
                classes={{
                    image: classes.currentImage,
                    root: classes.imageContainer
                }}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                ratio={IMAGE_RATIO}
                resource={smallImageURL}
            />
        );
    } else {
        image = (
            <Image
                alt="image"
                classes={{
                    image: classes.currentImage_placeholder,
                    root: classes.imageContainer
                }}
                width={IMAGE_WIDTH}
                height={IMAGE_HEIGHT}
                ratio={IMAGE_RATIO}
                src={transparentPlaceholder}
            />
        );
    }

    const brandUrl = isBlog ? `/${brand_url}` : brand_url;

    return (
        <div className={classes.root}>
            <Link onClick={handleLinkClick} to={productLink}>
                <section className={classes.reviews}>{reviewBlock}</section>
                <section className={classes.imageBlock}>
                    <AmProductLabels mode="CATEGORY" itemId={item.id} productWidth={IMAGE_WIDTH} />
                    <div
                        className={classNames(classes.imageRoot, {
                            [classes.largeImage]: name.length < 69,
                            [classes.smallImage]: 79 > name.length >= 69,
                            [classes.extraSmallImage]: name.length >= 79
                        })}
                    >
                        {image}
                    </div>
                </section>
                {brandUrl ? (
                    <section>
                        <Link className={classes.brandName} to={brandUrl}>
                            {brand_name}
                        </Link>
                    </section>
                ) : null}
                <section>
                    <div className={classes.name}>{name}</div>
                </section>
                <section>
                    <div className={classes.priceContainer}>
                        <div className={classes.price}>
                            <Price
                                classes={{
                                    currency: classes.productPriceCurrency,
                                    integer: classes.productPriceNumber,
                                    decimal: classes.productPriceNumber,
                                    fraction: classes.productPriceNumber
                                }}
                                currencyCode={price_range.maximum_price.final_price.currency}
                                value={finalPrice}
                            />
                        </div>
                        {discountedPrice}
                    </div>
                </section>
            </Link>
        </div>
    );
};

export default GalleryItem;
