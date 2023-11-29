import { string } from 'prop-types';
import React from 'react';

import { Heart } from '@app/components/Icons';
import { useNewArrivalsProducts } from '@app/components/NewArrivalsProducts/useNewArrivalsProducts';
import Slider from '@app/components/Slider';

import classes from './newArrivalsProducts.module.css';
import NewArrivalsProductsShimmer from './newArrivalsProducts.shimmer';

const NewArrivalsProducts = ({ sliderTitle, ...props }) => {
    const { products } = useNewArrivalsProducts();

    if (!products) return <NewArrivalsProductsShimmer />;
    if (products.length === 0) return null;

    const primaryTitle = sliderTitle && sliderTitle.split(' ').shift();
    const secondaryTitle = sliderTitle
        .split(' ')
        .slice(1)
        .join(' ');

    const title = (
        <div className={classes.sliderTitle}>
            <div className={classes.sliderTitleBold}>{primaryTitle}</div>
            <div className={classes.secondaryTitleWrapper}>
                {secondaryTitle}
                <Heart width={35} height={42} />
            </div>
        </div>
    );

    return <Slider {...props} products={products} title={title} classes={{ root: classes.newArrivalsRoot }} />;
};

NewArrivalsProducts.prototypes = {
    sliderTitle: string
};
export default NewArrivalsProducts;
