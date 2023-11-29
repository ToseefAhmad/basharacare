import { carouselSettings } from '@amasty/blog-pro/src/components/FeaturedPosts/carousel';
import defaultClasses from '@amasty/blog-pro/src/components/FeaturedPosts/featuredPosts.module.css';
import GET_POSTS_BY_IDS from '@amasty/blog-pro/src/queries/getPostsByIds.graphql';
import { useQuery } from '@apollo/client';
import { string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import SlickSlider from 'react-slick';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import Post from './post';
import RelatedPostsShimmer from './relatedPosts.shimmer';

const RelatedPosts = props => {
    const { relatedPostIds } = props;

    const ids = relatedPostIds.toString().split(',');

    const { loading, error, data } = useQuery(GET_POSTS_BY_IDS, {
        variables: {
            ids
        },
        skip: !ids
    });

    if (loading) {
        return <RelatedPostsShimmer />;
    }

    const { amBlogPostsByIds } = data || {};
    const { items } = amBlogPostsByIds || {};

    if (!items || !items.length || error) {
        return null;
    }

    const classes = mergeClasses(defaultClasses, props.classes);

    const posts = items.map(item => <Post key={item.post_id} {...item} />);
    const sliderSettings = { ...carouselSettings, infinite: items.length > 3, lazyLoad: true };

    return (
        <div className={classes.root}>
            <div className={classes.widgetTitle}>
                <FormattedMessage id="blogPost.similar" defaultMessage="Similar" />

                <div className={classes.widgetTitleBold}>
                    <FormattedMessage id="blogPage.articles" defaultMessage="Articles" />
                </div>
            </div>
            <div className={classes.slider}>
                <SlickSlider {...sliderSettings}>{posts}</SlickSlider>
            </div>
        </div>
    );
};

RelatedPosts.propTypes = {
    relatedPostIds: string
};

export default RelatedPosts;
