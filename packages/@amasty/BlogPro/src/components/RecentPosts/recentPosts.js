import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './recentPosts.module.css';
import { bool, number, string } from 'prop-types';
import { useQuery } from '@apollo/client';
import GET_RECENT_POSTS from '@amasty/blog-pro/src/queries/recentPostsWidget.graphql';
import Post from '@amasty/blog-pro/src/components/RecentPosts/post';
import { useAccordion } from '@amasty/blog-pro/src/talons/useAccordion';
import Trigger from '@magento/venia-ui/lib/components/Trigger';

const RecentPosts = props => {
  const { widgetId, title, accordionEnabled } = props;
  const { isOpen, handleToggle } = useAccordion({ accordionEnabled });

  const { loading, error, data } = useQuery(GET_RECENT_POSTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: widgetId
    }
  });

  if (loading || error) {
    return null;
  }

  const { amBlogRecentPostsWidget } = data || {};

  const { header_text, items } = amBlogRecentPostsWidget || {};

  if (!items || !items.length) {
    return <div>Posts were not found</div>;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const posts = items.map(item => (
    <Post key={item.post_id} {...item} {...amBlogRecentPostsWidget} />
  ));

  return (
    <div className={classes.root}>
      <div className={classes.title}>
        <Trigger action={handleToggle}>{header_text || title}</Trigger>
      </div>
      {isOpen && <div className={classes.comments}>{posts}</div>}
    </div>
  );
};

RecentPosts.propTypes = {
  widgetId: number,
  title: string,
  accordionEnabled: bool
};

RecentPosts.defaultProps = {
  widgetId: 0,
  title: 'Recent posts',
  accordionEnabled: false
};

export default RecentPosts;
