import React, { Suspense } from 'react';
import LazyLoad from 'react-lazyload';

import Slider from '@app/pageBuilder/ContentTypes/Products/Slider';
import useProduct from '@app/pageBuilder/ContentTypes/Products/useProduct';

import classes from './products.module.css';
import SliderShimmer from './Slider/slider.shimmer';

const Products = ({ pathNames }) => {
    const { items, loading, error } = useProduct({ pathNames });

    if (loading) return <SliderShimmer />;

    if (error || items.length === 0) {
        return null;
    }

    return (
        <>
            <LazyLoad offset={10} placeholder={<SliderShimmer />}>
                <Suspense fallback={<SliderShimmer />}>
                    <div className={classes.root}>
                        <div className={classes.header} />
                        <Slider products={items} />
                    </div>
                </Suspense>
            </LazyLoad>
        </>
    );
};

export default Products;
