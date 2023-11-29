import React from 'react';
import { FormattedMessage } from 'react-intl';

import Slider from '@app/components/Slider';

import classes from './relatedProducts.module.css';
import RelatedProductsShimmer from './relatedProducts.shimmer';

const RelatedProducts = ({ products }) => {
    if (!products) return <RelatedProductsShimmer />;
    if (products.length === 0) return null;

    const title = (
        <div className={classes.sliderTitle}>
            <div className={classes.sliderTitleBold}>
                <FormattedMessage id="relatedProducts.title" defaultMessage="Frequently" />
            </div>
            <div>
                <FormattedMessage id="relatedProducts.with" defaultMessage="with" />
            </div>
        </div>
    );

    const props = {
        products,
        title
    };

    return <Slider {...props} />;
};

export default RelatedProducts;
