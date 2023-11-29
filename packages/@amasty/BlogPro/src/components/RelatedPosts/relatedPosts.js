import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { useQuery } from '@apollo/client';
import GET_POSTS_BY_IDS from '@amasty/blog-pro/src/queries/getPostsByIds.graphql';
import defaultClasses from '../FeaturedPosts/featuredPosts.module.css';
import Post from '@amasty/blog-pro/src/components/RelatedPosts/post';
import { string } from 'prop-types';
import SlickSlider from 'react-slick';
import { carouselSettings } from '@amasty/blog-pro/src/components/FeaturedPosts/carousel';

const RelatedPosts = props => {
  const { relatedPostIds } = props;

  const ids = relatedPostIds.toString().split(',');

  const { loading, error, data } = useQuery(GET_POSTS_BY_IDS, {
    variables: {
      ids
    }
  });

  if (loading || error) {
    return null;
  }

  const { amBlogPostsByIds } = data || {};
  const { items } = amBlogPostsByIds || {};

  if (!items || !items.length) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const posts = items.map(item => <Post key={item.post_id} {...item} />);
  const sliderSettings = { ...carouselSettings, infinite: items.length > 3 };

  return (
    <div className={classes.root}>
      <div className={classes.widgetTitle}>{'Related posts'}</div>
      <div className={classes.carousel}>
        <SlickSlider {...sliderSettings}>{posts}</SlickSlider>
      </div>
    </div>
  );
};

RelatedPosts.propTypes = {
  relatedPostIds: string
};

export default RelatedPosts;
