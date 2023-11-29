import { string, number, shape } from 'prop-types';
import React from 'react';
import { ShoppingBag, XSquare } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import Button from '@app/components/overrides/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './addToCartButton.module.css';
import { useAddToCartButton } from './useAddToCartButton';

const AddToCartButton = props => {
    const { item, urlSuffix, algoliaQueryId } = props;
    const talonProps = useAddToCartButton({
        item,
        urlSuffix,
        algoliaQueryId
    });

    const { handleAddToCart, isDisabled, isInStock } = talonProps;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const AddToCartIcon = <Icon classes={{ icon: classes.icon }} src={ShoppingBag} attrs={{ width: 16 }} />;

    const OutOfStockIcon = <Icon classes={{ icon: classes.icon }} src={XSquare} attrs={{ width: 16 }} />;

    const buttonInStock = (
        <Button
            aria-label={formatMessage({
                id: 'addToCartButton.addItemToCartAriaLabel',
                defaultMessage: 'Add to Cart'
            })}
            className={classes.root}
            disabled={isDisabled}
            onPress={handleAddToCart}
            priority="high"
            type="button"
        >
            {AddToCartIcon}
            <span className={classes.text}>
                <FormattedMessage id="addToCartButton.addItemToCart" defaultMessage="ADD TO CART" />
            </span>
        </Button>
    );

    const buttonOutOfStock = (
        <Button
            aria-label={formatMessage({
                id: 'addToCartButton.itemOutOfStockAriaLabel',
                defaultMessage: 'Out of Stock'
            })}
            className={classes.root}
            disabled={isDisabled}
            onPress={handleAddToCart}
            priority="high"
            type="button"
        >
            {OutOfStockIcon}
            <span className={classes.text}>
                <FormattedMessage id="addToCartButton.itemOutOfStock" defaultMessage="OUT OF STOCK" />
            </span>
        </Button>
    );

    return isInStock ? buttonInStock : buttonOutOfStock;
};

export default AddToCartButton;

AddToCartButton.propTypes = {
    classes: shape({
        root: string,
        root_selected: string
    }),
    item: shape({
        id: number.isRequired,
        uid: string,
        name: string.isRequired,
        small_image: shape({
            url: string
        }),
        stock_status: string.isRequired,
        __typename: string.isRequired,
        url_key: string.isRequired,
        url_suffix: string,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    value: number,
                    currency: string
                })
            })
        })
    }),
    algoliaQueryId: string,
    urlSuffix: string
};
