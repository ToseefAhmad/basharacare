import React from 'react';
import { Link } from 'react-router-dom';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './recentComments.module.css';
import { formatDate, getURL } from '@amasty/blog-pro/src/utils';
import { BLOG_URLS_BY_SECTION, GUEST_NAME } from '@amasty/blog-pro/src/constants';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { bool, string } from 'prop-types';

const Comment = props => {
  const {
    created_at,
    message,
    name,
    post,
    post_title,
    date_manner,
    display_date
  } = props;

  const { title, url_key } = post;

  const { settings } = useAmBlogProContext();
  const { comments_display_short } = settings || {};

  const classes = mergeClasses(defaultClasses, props.classes);
  const postUrl = getURL(BLOG_URLS_BY_SECTION.POST, url_key);

  return (
    <div className={classes.commentRoot}>
      <Link
        to={`${postUrl}#comments`}
        title={post_title}
        className={classes.commentTitle}
      >
        {title}
      </Link>
      {comments_display_short && (
        <div className={classes.message}>{message}</div>
      )}

      {display_date && (
        <div className={classes.date}>
          {formatDate(created_at, date_manner)}
        </div>
      )}

      <div className={classes.user}>
        <span className={classes.icon} />
        <span className={classes.userName}>{name || GUEST_NAME}</span>
      </div>
    </div>
  );
};

Comment.propTypes = {
  created_at: string,
  message: string,
  name: string,
  post_title: string,
  date_manner: string,
  display_date: bool
};

export default Comment;
