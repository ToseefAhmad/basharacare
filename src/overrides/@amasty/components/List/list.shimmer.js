import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './list.module.css';
import PostShimmer from './post.shimmer.js';

const ListShimmer = ({ classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);

    const posts = new Array(9).fill(null).map((_, index) => {
        return <PostShimmer key={index} classes={{ root: classes.post }} />;
    });

    const pagination = (
        <div className={classes.paginationShimmer}>
            <div className={classes.paginationShimmerblock}>
                <Shimmer width="100%" height={2.25} key="blogPage.pagination" />
            </div>
        </div>
    );

    return (
        <div className={classes.gridRoot}>
            <div className={classes.posts}>{posts}</div>
            {pagination}
        </div>
    );
};

export default ListShimmer;
