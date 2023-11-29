/* eslint-disable react/jsx-no-target-blank */
import { string } from 'prop-types';
import React from 'react';

import TrendingProducts from '@app/components/TrendingProducts/trendingProducts';

/**
 * Trending Slider Component
 */
const TrendingSlider = ({ trendingTitle }) => {
    return <TrendingProducts sliderTitle={trendingTitle} />;
};

TrendingSlider.prototypes = {
    trendingTitle: string
};

export default TrendingSlider;
