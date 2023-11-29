import React from 'react';

import SliderShimmer from '@app/components/Slider/slider.shimmer';

import classes from './relatedProducts.module.css';

const RelatedProductsShimmer = () => {
    const relatedProducts = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

    const props = {
        products: relatedProducts,
        classes: {
            root: classes.relatedProducts,
            title: classes.relatedProductsTitle
        }
    };

    return <SliderShimmer {...props} />;
};

export default RelatedProductsShimmer;
