import React, { Fragment } from 'react';

import RelatedPostsShimmer from '../RelatedPosts/relatedPosts.shimmer';
import RelatedProductsShimmer from '../RelatedProducts/relatedProducts.shimmer';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './post.module.css';

const PostPageShimmer = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <div className={classes.postBreadcrumbs}>
                <div className={classes.postBreadCrumbsShimmer}>
                    <Shimmer width="100%" height={1} key="blogPage.post.breadcrumbs" />
                </div>
            </div>

            <div className={classes.main}>
                <div className={classes.postTags}>
                    <Shimmer width={6} height={1} key="blogPage.post.breadcrumbs" />
                </div>
                <div className={classes.postTitle}>
                    <Shimmer width="100%" height={6} key="blogPage.post.title" />
                </div>

                <div className={classes.postDate}>
                    <Shimmer width={6} height={1} key="blogPage.post.date" />
                </div>

                <Shimmer width="100%" height={50} key="blogPage.post.image" />

                <div className={classes.shareBlockTop}>
                    <Shimmer width="50%" height={1} key="blogPage.post.share" />
                </div>

                <div className={classes.content}>
                    <Shimmer width="100%" height={100} key="blogPage.post.breadcrumbs" />
                </div>

                <div className={classes.shareBlockBottom}>
                    <Shimmer width="50%" height={1} key="blogPage.post.share" />
                </div>

                <RelatedProductsShimmer />

                <RelatedPostsShimmer />
            </div>
        </Fragment>
    );
};

export default PostPageShimmer;
