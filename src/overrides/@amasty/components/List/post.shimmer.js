import defaultClasses from '@amasty/blog-pro/src/components/PostPage/post.module.css';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const PostShimmer = ({ classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <div className={classes.root}>
            <div className={classes.imageContainer}>
                <Shimmer width="100%" height="13.75rem" key="blogPage.post.image" />
            </div>

            <div className={classes.tags}>
                <Shimmer width="90%" height={1} key="blogPage.post.tags" />
            </div>

            <h2 className={classes.title}>
                <Shimmer width="100%" height={5} key="blogPage.post.title" />
            </h2>

            <div className={classes.date}>
                <Shimmer width={3} height={1} key="blogPage.post.date" />
            </div>

            <div className={classes.shortContent}>
                <Shimmer width="100%" height={4} key="blogPage.post.content" />
            </div>

            <div className={classes.footer}>
                <Shimmer width={5} height={1} key="blogPage.post.content" />
            </div>
        </div>
    );
};

export default PostShimmer;
