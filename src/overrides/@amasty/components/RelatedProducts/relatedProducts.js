import React from 'react';
import { FormattedMessage } from 'react-intl';

import Slider from '@app/components/Slider';

import classes from './relatedProducts.module.css';
import RelatedProductsShimmer from './relatedProducts.shimmer';

const RelatedProducts = ({ products }) => {
    if (!products) return <RelatedProductsShimmer classes={classes} />;
    if (products.length === 0) return null;

    const title = (
        <div className={classes.sliderTitle}>
            <div className={classes.sliderTitleBold}>
                <FormattedMessage id="relatedProducts.products" defaultMessage="Products" />
            </div>
            <FormattedMessage id="relatedProducts.fromArticle" defaultMessage="from article" />
        </div>
    );

    const props = {
        products,
        classes: {
            root: classes.relatedProducts,
            title: classes.relatedProductsTitle
        },
        galleryItemClasses: {
            brandName: classes.productBrandName,
            name: classes.productName
        },
        title
    };

    return <Slider isBlog {...props} />;
};

export default RelatedProducts;
