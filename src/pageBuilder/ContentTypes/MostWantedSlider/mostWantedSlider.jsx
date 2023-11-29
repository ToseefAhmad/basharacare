/* eslint-disable react/jsx-no-target-blank */
import { string } from 'prop-types';
import React from 'react';

import MostWantedProducts from '@app/components/MostWantedProducts';

/**
 * Most Wanted Slider Component
 */
const MostWantedSlider = ({ mostWantedTitle }) => {
    return <MostWantedProducts sliderTitle={mostWantedTitle} />;
};

MostWantedSlider.prototypes = {
    mostWantedTitle: string
};

export default MostWantedSlider;
