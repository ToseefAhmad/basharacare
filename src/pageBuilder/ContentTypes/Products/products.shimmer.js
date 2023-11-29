import { shape, string } from 'prop-types';
import React from 'react';

import SliderShimmer from './Slider/slider.shimmer';

/**
 * Page Builder Products Shimmer component.
 *
 * @typedef ProductsShimmer
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Products Shimmer.
 */
const ProductsShimmer = () => {
    return <SliderShimmer />;
};

ProductsShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default ProductsShimmer;
