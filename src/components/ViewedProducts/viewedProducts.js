import React from 'react';
import { FormattedMessage } from 'react-intl';

import classes from '@app/components/RelatedProducts/relatedProducts.module.css';
import Slider from '@app/components/Slider';

import ViewedProductsShimmer from './viewedProducts.shimmer';
import galleryItemClasses from './viewedProductsGalleryItem.module.css';

const ViewedProducts = ({ products }) => {
    if (!products) return <ViewedProductsShimmer />;
    if (products.length === 0) return null;

    const title = (
        <div className={classes.sliderTitle}>
            <div className={classes.sliderTitleBold}>
                <FormattedMessage id="viewedProducts.title.viewed" defaultMessage="Viewed" />
            </div>
            <div>
                <FormattedMessage id="viewedProducts.title.products" defaultMessage="products" />
            </div>
        </div>
    );

    const props = {
        galleryItemClasses,
        products,
        title
    };

    return <Slider {...props} />;
};

export default ViewedProducts;
