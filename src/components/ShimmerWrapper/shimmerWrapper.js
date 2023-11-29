import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './shimmerWrapper.module.css';

const ShimmerWrapper = ({ children, isShimmer, style, ...props }) => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <>
            {isShimmer ? (
                <div className={classes.root}>
                    <Shimmer
                        {...props}
                        style={!style && { height: '100%', width: '100%' }}
                        classes={{ root_rectangle: classes.shimmerRoot }}
                    />
                </div>
            ) : (
                children
            )}
        </>
    );
};

export default ShimmerWrapper;
