import React, { useEffect, useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import Button from '@app/components/overrides/Button';
import { useToasts } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';

import defaultClasses from './routineItem.module.css';
import RoutineItemShimmer from './routineItem.shimmer';
import { useRoutineItem } from './useRoutineItem';

// The placeholder image is 4:5, so we should make sure to size our product
// Images appropriately.
const IMAGE_WIDTH = 300;
const IMAGE_HEIGHT = 375;

const RoutineItem = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const [, { addToast }] = useToasts();

    const { item } = props;
    const { configurable_options: configurableOptions = [], product, description } = item;
    const { name, stock_status: stockStatus, brand_name: brandName, brand_url: brandUrl, url: productUrl } = product;
    const { addToCartButtonProps, hasError, isSupportedProductType } = useRoutineItem(props);

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

    const addToCart = isSupportedProductType ? (
        <Button
            className={classes.addToCart}
            priority="high"
            {...addToCartButtonProps}
            data-cy="wishlistItem-addToCart"
        >
            <span className={classes.text}>
                <FormattedMessage id="addToCartButton.addItemToCart" defaultMessage="Add to Cart" />
            </span>
        </Button>
    ) : null;

    return item ? (
        <div className={classes.root} data-cy="wishlistItem-root">
            <div className={classes.itemsCard}>
                <a href={productUrl} className={classes.images}>
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
                </a>
                <div className={classes.namePriceContainer}>
                    {brandUrl ? (
                        <Link className={classes.brandName} to={brandUrl}>
                            {brandName}
                        </Link>
                    ) : null}
                    <a className={classes.name} href={productUrl}>
                        {name}
                    </a>
                    {description}
                </div>
            </div>
            <div className={classes.addToCartButtonWrapper}>{addToCart}</div>
            {optionElements}
        </div>
    ) : (
        <RoutineItemShimmer />
    );
};

export default RoutineItem;
