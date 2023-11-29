import React from 'react';
import { FormattedMessage } from 'react-intl';

import configuredVariant from '@magento/peregrine/lib/util/configuredVariant';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Price from '@magento/venia-ui/lib/components/Price';

import defaultClasses from './item.module.css';

const Item = props => {
    const {
        classes: propClasses,
        product,
        quantity,
        prices,
        configurable_options,
        isHidden,
        configurableThumbnailSource
    } = props;

    const { row_total_including_tax: price } = prices;
    const { currency, value: unitPrice } = price;
    const itemTotalPrice = unitPrice * quantity;

    const classes = useStyle(defaultClasses, propClasses);
    const className = isHidden ? classes.root_hidden : classes.root;
    const configured_variant = configuredVariant(configurable_options, product);
    return (
        <div className={className}>
            <Image
                alt={product.name}
                classes={{
                    image: classes.image,
                    loaded: classes.imageLoaded,
                    notLoaded: classes.imageNotLoaded,
                    root: classes.imageContainer
                }}
                width={100}
                resource={
                    configurableThumbnailSource === 'itself' && configured_variant
                        ? configured_variant.thumbnail.url
                        : product.thumbnail.url
                }
            />
            <span className={classes.name}>{product.name}</span>
            <ProductOptions
                options={configurable_options}
                classes={{
                    options: classes.options
                }}
            />
            <span className={classes.quantity}>
                <FormattedMessage id="checkoutPage.quantity" defaultMessage="Qty : {quantity}" values={{ quantity }} />
            </span>
            <span className={classes.itemTotalPrice}>
                <span>
                    <FormattedMessage id="checkoutPage.total" defaultMessage="Total: " />{' '}
                </span>
                <Price currencyCode={currency} value={itemTotalPrice} />
            </span>
        </div>
    );
};

export default Item;
