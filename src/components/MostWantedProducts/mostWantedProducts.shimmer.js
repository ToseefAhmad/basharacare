import React from 'react';

import SliderShimmer from '@app/components/Slider/slider.shimmer';

const MostWantedProductsShimmer = () => {
    const mostWantedProducts = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

    const props = {
        products: mostWantedProducts
    };

    return <SliderShimmer {...props} />;
};

export default MostWantedProductsShimmer;
