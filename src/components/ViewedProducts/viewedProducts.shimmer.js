import React from 'react';

import SliderShimmer from '@app/components/Slider/slider.shimmer';

const ViewedProductsShimmer = () => {
    const viewedProducts = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

    const props = {
        products: viewedProducts
    };

    return <SliderShimmer {...props} />;
};

export default ViewedProductsShimmer;
