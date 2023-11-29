import React from 'react';

import { useCmsPageContext } from '@app/RootComponents/CMS/cms';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './accordion.module.css';

const AccordionShimmer = () => {
    const { pageType } = useCmsPageContext();
    const shimmerCollection = [];

    let limiter;

    switch (pageType) {
        case 'faq':
            limiter = 10;
            break;
        default:
            limiter = 5;
    }

    for (let i = 0; i < limiter; i++) {
        shimmerCollection.push(
            <Shimmer
                key={i}
                aria-live="polite"
                aria-busy="true"
                width="100%"
                classes={{ root_rectangle: classes.shimmer }}
            />
        );
    }

    return shimmerCollection;
};

export default AccordionShimmer;
