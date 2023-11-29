import React from 'react';

import { Meta } from '@magento/venia-ui/lib/components/Head';

const OpenGraph = ({ metaArray }) => {
    const isShow = metaArray?.is_show || true;
    if (!isShow) {
        return;
    }
    return Object.keys(metaArray).map(key => {
        if (key !== '__typename' && 'is_show' !== key && metaArray[key]) {
            return <Meta key={key} property={`og:${key}`} content={metaArray[key]} />;
        }
    });
};

export default OpenGraph;
