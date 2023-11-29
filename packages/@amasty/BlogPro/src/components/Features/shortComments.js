import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@amasty/blog-pro/src/components/PostPage/post.module.css';
import { number } from 'prop-types';
import { Link } from 'react-router-dom';

const ShortComments = props => {
  const { commentCount, postUrl } = props;

  const classes = mergeClasses(defaultClasses, props.classes);
  const count = commentCount ? commentCount : 'No';
  const content = `${count} comment${commentCount !== 1 ? 's' : ''}`;
  const path = `${postUrl}#comments`;

  return (
    <div className={classes.comments}>
      <span className={classes.commentsIcon} />
      <Link className={classes.commentsLink} to={path}>
        {content}
      </Link>
    </div>
  );
};

ShortComments.propTypes = {
  commentCount: number.isRequired
};

ShortComments.defaultProps = {
  commentCount: 0
};

export default ShortComments;
