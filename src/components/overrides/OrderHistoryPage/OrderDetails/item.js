import { shape, string, number, arrayOf } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import Price from '@app/components/overrides/Price';
import { useOrderHistoryContext } from '@magento/peregrine/lib/talons/OrderHistoryPage/orderHistoryContext';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './item.module.css';

const Item = props => {
    const { product_name, product_sale_price, product_sku, product_url_key, quantity_ordered } = props;
    const { currency, value: unitPrice } = product_sale_price;

    const orderHistoryState = useOrderHistoryContext();
    const { productURLSuffix } = orderHistoryState;
    const itemLink = `${product_url_key}${productURLSuffix || ''}`;
    const classes = useStyle(defaultClasses, props.classes);
    const productNameBlock = unitPrice > 0 ? <Link to={itemLink}>{product_name}</Link> : <span>{product_name}</span>;

    return (
        <div className={classes.root}>
            <div className={classes.nameContainer}>
                <span className={classes.nameLabel}>
                    <FormattedMessage id="orderItem.itemNameLabel" defaultMessage="Product Name" />
                </span>
                {productNameBlock}
            </div>
            <div className={classes.skuContainer}>
                <span className={classes.skuLabel}>
                    <FormattedMessage id="orderItem.itemSkuLabel" defaultMessage="SKU" />
                </span>
                {product_sku}
            </div>
            <div className={classes.priceContainer}>
                <span className={classes.priceLabel}>
                    <FormattedMessage id="orderItem.itemPriceLabel" defaultMessage="Price" />
                </span>
                <div>
                    <Price currencyCode={currency} value={unitPrice} />
                </div>
            </div>
            <span className={classes.qtyContainer}>
                <span className={classes.qtyLabel}>
                    <FormattedMessage id="orderItem.itemqtyLabel" defaultMessage="Qty" />
                </span>
                {quantity_ordered}
            </span>
        </div>
    );
};

export default Item;

Item.propTypes = {
    classes: shape({
        root: string,
        thumbnailContainer: string,
        thumbnail: string,
        name: string,
        options: string,
        quantity: string,
        price: string,
        buyAgainButton: string
    }),
    product_name: string.isRequired,
    product_sale_price: shape({
        currency: string,
        value: number
    }).isRequired,
    product_url_key: string.isRequired,
    quantity_ordered: number.isRequired,
    selected_options: arrayOf(
        shape({
            label: string,
            value: string
        })
    ).isRequired,
    thumbnail: shape({
        url: string
    })
};
