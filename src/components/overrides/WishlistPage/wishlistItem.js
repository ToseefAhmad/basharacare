import React, { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import Price from '../Price';

import Button from '@app/components/overrides/Button';
import LinkButton from '@app/components/overrides/LinkButton';
import WishlistItemsShimmer from '@app/components/overrides/WishlistPage/wishlistItem.shimmer';
import { useToasts } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';

import { useWishlistItem } from './useWishlistItem';
import defaultClasses from './wishlistItem.module.css';

// The placeholder image is 4:5, so we should make sure to size our product
// Images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

const WishlistItem = props => {
    const { item, isSender } = props;

    const { configurable_options: configurableOptions = [], product, quantity, description } = item;
    const [qty, setQty] = useState(quantity);
    const [comment, setComment] = useState(description);
    const [hasChanged, setHasChanged] = useState(false);
    useEffect(() => {
        setHasChanged(quantity !== qty || comment !== description);
    }, [qty, comment, description, quantity, setHasChanged]);
    const {
        name,
        price_range: priceRange,
        stock_status: stockStatus,
        brand_name: brandName,
        brand_url: brandUrl,
        url: productUrl,
        is_sample: isSample
    } = product;

    const talonProps = useWishlistItem(props, qty, comment);
    const {
        addToCartButtonProps,
        handleRemoveProductFromWishlist,
        hasError,
        handleUpdateWishlistItem,
        isRemovalInProgress,
        isSupportedProductType
    } = talonProps;

    const isSampleProduct = isSample === '1';
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    useEffect(() => {
        if (hasError) {
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'wishlistItem.addToCartError',
                    defaultMessage: 'Something went wrong. Please refresh and try again.'
                }),
                timeout: 5000
            });
        }
    }, [addToast, formatMessage, hasError]);

    const classes = useStyle(defaultClasses, props.classes);

    const optionElements = useMemo(() => {
        return configurableOptions.map(option => {
            const { id, option_label: optionLabel, value_label: valueLabel } = option;

            const optionString = `${optionLabel} : ${valueLabel}`;

            return (
                <span className={classes.option} key={id}>
                    {optionString}
                </span>
            );
        });
    }, [classes.option, configurableOptions]);

    const smallImageUrl = item ? item.product.image.url : '';

    const removeProductAriaLabel = formatMessage({
        id: 'wishlistItem.removeAriaLabel',
        defaultMessage: 'Remove Product from wishlist'
    });

    const finalPrice = priceRange.maximum_price.final_price.value;

    const regularPrice = priceRange.maximum_price.regular_price ? priceRange.maximum_price.regular_price.value : '';

    const discountedPrice = (
        <div className={classes.discountedPrice}>
            {regularPrice > finalPrice && (
                <Price value={regularPrice} currencyCode={priceRange.maximum_price.regular_price.currency} />
            )}
        </div>
    );

    const rootClass = isRemovalInProgress ? classes.root_disabled : classes.root;

    const updateItem = hasChanged ? (
        <Button priority="high" onClick={handleUpdateWishlistItem} data-cy="wishlistItem-updateItem">
            {formatMessage({
                id: 'wishlistItem.updateItem',
                defaultMessage: 'Update Item'
            })}
        </Button>
    ) : null;

    const addToCart =
        !hasChanged && isSupportedProductType ? (
            <Button priority="high" {...addToCartButtonProps} data-cy="wishlistItem-addToCart">
                {formatMessage({
                    id: 'wishlistItem.addToCart',
                    defaultMessage: 'Add to Cart'
                })}
            </Button>
        ) : null;

    const image = (
        <Image
            alt={name}
            classes={{
                image: stockStatus === 'OUT_OF_STOCK' ? classes.image_disabled : classes.image,
                loaded: classes.imageLoaded,
                notLoaded: classes.imageNotLoaded,
                root: classes.imageContainer
            }}
            height={IMAGE_HEIGHT}
            resource={smallImageUrl}
            width={IMAGE_WIDTH}
        />
    );

    const imageBlock = !isSampleProduct ? (
        <a href={productUrl} className={classes.images}>
            {image}
        </a>
    ) : (
        <div className={classes.images}>{image}</div>
    );

    const nameBlock = !isSampleProduct ? (
        <a className={classes.name} href={productUrl}>
            {name}
        </a>
    ) : (
        <div className={classes.name}>{name}</div>
    );

    const wishlistItemContent = item ? (
        <div className={rootClass} data-cy="wishlistItem-root">
            <div className={classes.itemsCard}>
                {imageBlock}
                <div className={classes.namePriceContainer}>
                    <Link className={classes.brandName} to={brandUrl}>
                        {brandName}
                    </Link>
                    {nameBlock}
                    <div className={classes.priceContainer}>
                        <div className={classes.price}>
                            <Price value={finalPrice} currencyCode={priceRange.maximum_price.final_price.currency} />
                        </div>
                        {discountedPrice}
                    </div>
                </div>
            </div>
            {isSender ? (
                <div>
                    <span>
                        <FormattedMessage id="reviewsPage.descriptionLabel" defaultMessage="Description" />
                    </span>
                    <textarea
                        id="description"
                        value={comment}
                        onChange={e => setComment(e.target.value)}
                        className={classes.description}
                    />
                </div>
            ) : null}
            {!isSampleProduct && (
                <div className={classes.qty}>
                    <span>
                        <FormattedMessage id="reviewsPage.qtyLabel" defaultMessage="Qty" />
                    </span>
                    <input type="number" id="name" value={qty} onChange={e => setQty(e.target.value)} />
                </div>
            )}

            <div className={classes.updateItemButtonWrapper}>{updateItem}</div>
            <div className={classes.addToCartButtonWrapper}>{addToCart}</div>

            <div className={classes.actionContainer}>
                {!isSampleProduct && (
                    <a className={classes.edit} href={productUrl}>
                        <FormattedMessage id="wishlistPage.editItemText" defaultMessage="Edit" />
                    </a>
                )}
                <LinkButton
                    className={classes.deleteItem}
                    onClick={handleRemoveProductFromWishlist}
                    aria-label={removeProductAriaLabel}
                    data-cy="wishlistItem-deleteItem"
                >
                    <FormattedMessage id="wishlistPage.removeItemText" defaultMessage="Remove item" />
                </LinkButton>
            </div>

            {optionElements}
        </div>
    ) : (
        <WishlistItemsShimmer />
    );

    return <>{wishlistItemContent}</>;
};

export default WishlistItem;
