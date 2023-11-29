import { shape, string } from 'prop-types';
import React from 'react';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const CMSPageShimmer = () => {
    return (
        <div aria-live="polite" aria-busy="true">
            <Shimmer width="100%" height="880px" key="banner" />
        </div>
    );
};

CMSPageShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default CMSPageShimmer;
