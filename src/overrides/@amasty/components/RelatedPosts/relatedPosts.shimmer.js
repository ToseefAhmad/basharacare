import { carouselSettings } from '@amasty/blog-pro/src/components/FeaturedPosts/carousel';
import defaultClasses from '@amasty/blog-pro/src/components/FeaturedPosts/featuredPosts.module.css';
import React from 'react';
import SlickSlider from 'react-slick';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import PostShimmer from './post.shimmer';

const RelatedPostsShimmer = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    const posts = Array(5)
        .fill(null)
        .map((item, index) => <PostShimmer key={index} />);
    const sliderSettings = { ...carouselSettings, lazyLoad: true };

    return (
        <div className={classes.root}>
            <div className={classes.widgetTitle}>
                <Shimmer key="relatedArticles.title" width={15} height={3} />
            </div>
            <div className={classes.slider}>
                <SlickSlider {...sliderSettings}>{posts}</SlickSlider>
            </div>
        </div>
    );
};

export default RelatedPostsShimmer;
