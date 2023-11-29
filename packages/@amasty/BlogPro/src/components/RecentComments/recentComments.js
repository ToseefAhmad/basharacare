import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './recentComments.module.css';
import { bool, number, string } from 'prop-types';
import { useQuery } from '@apollo/client';
import GET_RECENT_COMMENTS from '@amasty/blog-pro/src/queries/recentCommentsWidget.graphql';
import Comment from '@amasty/blog-pro/src/components/RecentComments/comment';
import { useAccordion } from '@amasty/blog-pro/src/talons/useAccordion';
import Trigger from '@magento/venia-ui/lib/components/Trigger';

const RecentComments = props => {
  const { widgetId, title, accordionEnabled } = props;
  const { isOpen, handleToggle } = useAccordion({ accordionEnabled });

  const { loading, error, data } = useQuery(GET_RECENT_COMMENTS, {
    fetchPolicy: 'cache-and-network',
    variables: {
      id: widgetId
    }
  });

  if (loading || error) {
    return null;
  }

  const { amBlogRecentCommentsWidget } = data || {};
  const { header_text, items } = amBlogRecentCommentsWidget || {};

  if (!items || !items.length) {
    return <div>Comments were not found</div>;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const comments = items.map(item => (
    <Comment key={item.comment_id} {...item} {...amBlogRecentCommentsWidget} />
  ));

  return (
    <div className={`${classes.root} ${classes.gridArea}`}>
      <div className={classes.title}>
        <Trigger action={handleToggle}>{header_text || title}</Trigger>
      </div>
      {isOpen && <div className={classes.comments}>{comments}</div>}
    </div>
  );
};

RecentComments.propTypes = {
  widgetId: number,
  title: string,
  accordionEnabled: bool
};

RecentComments.defaultProps = {
  widgetId: 0,
  title: 'Recent Comments',
  accordionEnabled: false
};

export default RecentComments;
