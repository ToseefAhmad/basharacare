import { string } from 'prop-types';
import React from 'react';

import { Stars } from '@app/components/Icons';
import { useMostWantedProducts } from '@app/components/MostWantedProducts/useMostWantedProducts';
import Slider from '@app/components/Slider';

import classes from './mostWantedProducts.module.css';
import MostWantedProductsShimmer from './mostWantedProducts.shimmer';

const MostWantedProducts = ({ sliderTitle }) => {
    const { products } = useMostWantedProducts();

    if (!products) return <MostWantedProductsShimmer />;
    if (products.length === 0) return null;

    const title = (
        <>
            <div className={classes.sliderTitleBold}>{sliderTitle}</div>
            <Stars width={35} height={42} />
        </>
    );

    const props = {
        products,
        title
    };

    return <Slider {...props} classes={{ root: classes.mostWantedProductsRoot, title: classes.sliderTitle }} />;
};

MostWantedProducts.prototypes = {
    sliderTitle: string
};
export default MostWantedProducts;
