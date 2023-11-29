import { string } from 'prop-types';
import React from 'react';

import NewArrivalsProducts from '@app/components/NewArrivalsProducts';

/**
 * New Arrivals Slider Component
 */
const NewArrivalsSlider = ({ newArrivalsTitle }) => {
    return <NewArrivalsProducts sliderTitle={newArrivalsTitle} />;
};

NewArrivalsSlider.prototypes = {
    newArrivalsTitle: string
};

export default NewArrivalsSlider;
