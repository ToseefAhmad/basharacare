import { string, number, shape, func, arrayOf, oneOf } from 'prop-types';
import React, { useEffect, useMemo } from 'react';
import { X as DeleteIcon } from 'react-feather';
import { useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import Quantity from '../../CartPage/ProductListing/quantity';

import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './item.module.css';
import { useItem } from './useItem';

const Item = props => {
    const {
        classes: propClasses,
        loading,
        product,
        id,
        uid,
        quantity,
        configurable_options,
        handleRemoveItem,
        handleUpdateItemQuantity,
        prices,
        onProductClick,
        configurableThumbnailSource,
        storeUrlSuffix
    } = props;

    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, propClasses);
    const itemLink = useMemo(() => resourceUrl(`/${product.url_key}${storeUrlSuffix || ''}`), [
        product.url_key,
        storeUrlSuffix
    ]);
    const stockStatusText =
        product.stock_status === 'OUT_OF_STOCK'
            ? formatMessage({
                  id: 'productList.outOfStock',
                  defaultMessage: 'Out-of-stock'
              })
            : '';

    const { isLoading, removeItem, updateItemQuantity, handleProductClick } = useItem({
        loading,
        uid,
        product,
        quantity,
        handleRemoveItem,
        handleUpdateItemQuantity,
        onProductClick
    });

    const isSample = product.is_sample === '1' || false;

    // In cases when somehow user set qty more than 1 to Sample product
    useEffect(() => {
        if (isSample && quantity > 1) {
            updateItemQuantity(1);
        }
    }, [quantity, isSample, updateItemQuantity]);

    const rootClass = isLoading ? classes.root_disabled : classes.root;
    const configured_variant = configuredVariant(configurable_options, product);

    const thumbnail = (
        <Image
            alt={product.name}
            classes={{
                root: classes.thumbnail
            }}
            width={100}
            resource={
                configurableThumbnailSource === 'itself' && configured_variant
                    ? configured_variant.thumbnail.url
                    : product.thumbnail.url
            }
        />
    );
    const imageBlock = !isSample ? (
        <Link
            className={classes.thumbnailContainer}
            to={itemLink}
            onClick={handleProductClick}
            data-cy="item-thumbnailContainer"
        >
            {thumbnail}
        </Link>
    ) : (
        <div className={classes.thumbnailContainer}>{thumbnail}</div>
    );

    const productName = !isSample ? (
        <Link className={classes.name} to={itemLink} onClick={handleProductClick} data-cy="item-name">
            {product.name}
        </Link>
    ) : (
        <div className={classes.name}>{product.name}</div>
    );

    return (
        <div className={rootClass} data-cy="MiniCart-Item-root">
            {imageBlock}
            {productName}
            <ProductOptions
                options={configurable_options}
                classes={{
                    options: classes.options
                }}
            />
            {!isSample && (
                <div className={classes.quantity}>
                    <Quantity itemId={id} initialValue={quantity} onChange={updateItemQuantity} disabled={isLoading} />
                </div>
            )}
            <span className={classes.price}>
                <Price
                    currencyCode={prices.row_total_including_tax.currency}
                    value={prices.row_total_including_tax.value / quantity}
                    classes={{
                        currency: classes.currency,
                        decimal: classes.currency,
                        integer: classes.priceNumber,
                        fraction: classes.priceNumber
                    }}
                />
            </span>
            <span className={classes.stockStatus}>{stockStatusText}</span>
            <button
                onClick={removeItem}
                type="button"
                className={classes.deleteButton}
                disabled={isLoading}
                data-cy="MiniCart-Item-deleteButton"
            >
                <Icon
                    size={16}
                    src={DeleteIcon}
                    classes={{
                        icon: classes.editIcon
                    }}
                />
            </button>
        </div>
    );
};

export default Item;

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        editButton: string,
        editIcon: string
    }),
    product: shape({
        name: string,
        thumbnail: shape({
            url: string
        }),
        is_sample: string
    }),
    id: string,
    quantity: number,
    configurable_options: arrayOf(
        shape({
            id: number,
            option_label: string,
            value_id: number,
            value_label: string
        })
    ),
    handleRemoveItem: func,
    prices: shape({
        price: shape({
            value: number,
            currency: string
        })
    }),
    configured_variant: shape({
        thumbnail: shape({
            url: string
        })
    }),
    configurableThumbnailSource: oneOf(['parent', 'itself'])
};
