import defaultClasses from '@amasty/blog-pro/src/components/FeaturedPosts/featuredPosts.module.css';
import React from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const PostShimmer = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.post}>
            <div className={classes.images}>
                <Shimmer key="relatedArticle.image" width="100%" height={15} />
            </div>

            <div className={classes.tags}>
                <Shimmer width="50%" height={1} key="relatedArticle.tags" />
            </div>

            <h2 className={classes.title}>
                <Shimmer width="100%" height={3} key="relatedArticle.title" />
            </h2>

            <div className={classes.date}>
                <Shimmer width={3} height={1} key="relatedArticle.date" />
            </div>

            <div className={classes.shortContent}>
                <Shimmer width="100%" height={4} key="relatedArticle.content" />
            </div>

            <div className={classes.footer}>
                <Shimmer width={5} height={1} key="relatedArticle.content" />
            </div>
        </div>
    );
};

export default PostShimmer;
