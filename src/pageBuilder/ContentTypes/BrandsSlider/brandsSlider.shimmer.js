import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './brandsSlider.module.css';
/**
 *
 * @returns {JSX.Element}
 * @constructor
 */
const BrandsSliderShimmer = () => {
    return <Shimmer height="78px" classes={{ root_rectangle: classes.brandsShimmer }} />;
};

export default BrandsSliderShimmer;
