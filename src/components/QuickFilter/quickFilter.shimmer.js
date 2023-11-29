import React, { useMemo } from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './quickfilter.module.css';
import listClasses from './quickFilterList.module.css';

const QuickFilterShimmer = () => {
    const classes = useStyle(defaultClasses, listClasses);
    const shimmers = useMemo(
        () => Array.from({ length: 5 }).map((item, idx) => <Shimmer key={`shimmer_${idx}`} width={8} height={1.5} />),
        []
    );

    return (
        <div className={classes.body}>
            <div className={classes.items}>{shimmers}</div>
        </div>
    );
};

export default QuickFilterShimmer;
