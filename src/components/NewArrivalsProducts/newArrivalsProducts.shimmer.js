import React from 'react';

import SliderShimmer from '@app/components/Slider/slider.shimmer';

const NewArrivalsProductsShimmer = () => {
    const newArrivalsProducts = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }];

    const props = {
        products: newArrivalsProducts
    };

    return <SliderShimmer {...props} />;
};

export default NewArrivalsProductsShimmer;
