import { gql } from '@apollo/client';
import React, { useMemo } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Link } from 'react-router-dom';

import { useUserContext } from '@magento/peregrine/lib/context/user';
import { CartPageFragment } from '@magento/peregrine/lib/talons/CartPage/cartPageFragments.gql.js';
import { AvailableShippingMethodsCartFragment } from '@magento/peregrine/lib/talons/CartPage/PriceAdjustments/ShippingMethods/shippingMethodsFragments.gql.js';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import ProductOptions from '@magento/venia-ui/lib/components/LegacyMiniCart/productOptions';
import Price from '@magento/venia-ui/lib/components/Price';
import AddToListButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';

import defaultClasses from './product.module.css';
import Quantity from './quantity';
import { useProduct } from './useProduct';

const IMAGE_SIZE = 100;

const Product = props => {
    const { item } = props;

    const { formatMessage } = useIntl();
    const talonProps = useProduct({
        operations: {
            removeItemMutation: REMOVE_ITEM_MUTATION,
            updateItemQuantityMutation: UPDATE_QUANTITY_MUTATION
        },
        ...props
    });

    const {
        addToWishlistProps,
        handleRemoveFromCart,
        handleUpdateItemQuantity,
        handleProductClick,
        product,
        isProductUpdating
    } = talonProps;

    const [{ isSignedIn }] = useUserContext();

    const isSample = item?.product?.is_sample === '1' || false;

    const { currency, image, name, options, quantity, stockStatus, unitPrice, urlKey, urlSuffix } = product;

    const classes = useStyle(defaultClasses, props.classes);

    const itemClassName = isProductUpdating ? classes.item_disabled : classes.item;

    const productSubtotal = quantity * unitPrice;

    const itemLink = useMemo(() => resourceUrl(`/${urlKey}${urlSuffix || ''}`), [urlKey, urlSuffix]);

    const stockStatusMessage =
        stockStatus === 'OUT_OF_STOCK'
            ? formatMessage({
                  id: 'product.outOfStock',
                  defaultMessage: 'Out-of-stock'
              })
            : '';

    const productImage = (
        <Image
            alt={name}
            classes={{
                root: classes.imageRoot,
                image: classes.image
            }}
            width={IMAGE_SIZE}
            resource={image}
        />
    );

    return (
        <div className={classes.root} data-cy="Product-root">
            <div className={itemClassName}>
                <div className={classes.details}>
                    {productSubtotal === 0 ? (
                        <div className={classes.imageContainer} data-cy="Product-imageContainer">
                            {productImage}
                        </div>
                    ) : (
                        <Link
                            to={itemLink}
                            onClick={handleProductClick}
                            className={classes.imageContainer}
                            data-cy="Product-imageContainer"
                        >
                            {productImage}
                        </Link>
                    )}
                    <div className={classes.name} data-cy="Product-name">
                        {productSubtotal === 0 ? (
                            <span>{name}</span>
                        ) : (
                            <Link to={itemLink} onClick={handleProductClick}>
                                {name}
                            </Link>
                        )}
                    </div>
                    <ProductOptions
                        options={options}
                        classes={{
                            options: classes.options,
                            optionLabel: classes.optionLabel
                        }}
                    />

                    <span className={classes.stockStatusMessage}>{stockStatusMessage}</span>
                </div>

                <div className={classes.priceQtySubtoal}>
                    <div className={classes.priceContainer}>
                        <span className={classes.priceLabel}>Price</span>
                        <span className={classes.price} data-cy="Product-price">
                            <Price currencyCode={currency} value={unitPrice} />
                        </span>
                    </div>
                    <div className={isSample ? classes.quantityEmptyContainer : classes.quantityContainer}>
                        <span className={classes.quantityLabel}>Qty</span>
                        <div className={classes.quantity}>
                            <Quantity
                                hidden={unitPrice === 0}
                                itemId={item.id}
                                initialValue={quantity}
                                onChange={handleUpdateItemQuantity}
                            />
                        </div>
                    </div>
                    <div className={classes.subtotalContainer}>
                        <span className={classes.subtotalLabel}>Subtotal</span>
                        <span className={classes.price} data-cy="Product-price">
                            {productSubtotal === 0 ? (
                                <FormattedMessage id="product.free" defaultMessage="Free" />
                            ) : (
                                <Price currencyCode={currency} value={productSubtotal} />
                            )}
                        </span>
                    </div>
                </div>

                <div className={classes.actions}>
                    {isSignedIn && !isSample && (
                        <div className={classes.wishlist}>
                            <AddToListButton {...addToWishlistProps} />
                        </div>
                    )}
                    <button onClick={handleRemoveFromCart}>
                        <FormattedMessage id="product.remove" defaultMessage="Remove" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Product;

export const REMOVE_ITEM_MUTATION = gql`
    mutation removeItem($cartId: String!, $itemId: ID!) {
        removeItemFromCart(input: { cart_id: $cartId, cart_item_uid: $itemId }) {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;

export const UPDATE_QUANTITY_MUTATION = gql`
    mutation updateItemQuantity($cartId: String!, $itemId: ID!, $quantity: Float!) {
        updateCartItems(input: { cart_id: $cartId, cart_items: [{ cart_item_uid: $itemId, quantity: $quantity }] }) {
            cart {
                id
                ...CartPageFragment
                ...AvailableShippingMethodsCartFragment
            }
        }
    }
    ${CartPageFragment}
    ${AvailableShippingMethodsCartFragment}
`;
