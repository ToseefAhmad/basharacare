import { string } from 'prop-types';
import React from 'react';

import { Star } from '@app/components/Icons';
import Slider from '@app/components/Slider';
import { useTrendingProducts } from '@app/components/TrendingProducts/useTrendingProducts.js';

import classes from './trendingProducts.module.css';
import TrendingProductsShimmer from './trendingProducts.shimmer';

const TrendingProducts = ({ sliderTitle }) => {
    const { products } = useTrendingProducts();

    if (!products) return <TrendingProductsShimmer />;
    if (products.length === 0) return null;

    const primaryTitle = sliderTitle.split(' ').shift();
    const secondaryTitle = sliderTitle
        .split(' ')
        .slice(1)
        .join(' ');

    const title = (
        <div className={classes.sliderTitle}>
            <div className={classes.sliderTitleBold}>{primaryTitle}</div>
            <div className={classes.secondaryTitleWrapper}>
                {secondaryTitle}
                <Star fill="black" width={35} height={42} />
            </div>
        </div>
    );

    const props = {
        products,
        title
    };

    return <Slider {...props} classes={{ root: classes.trendingProductsRoot }} />;
};

TrendingProducts.prototypes = {
    sliderTitle: string
};
export default TrendingProducts;
