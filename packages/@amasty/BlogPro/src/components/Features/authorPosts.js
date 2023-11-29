import React from 'react';
import { Link } from 'react-router-dom';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../PostPage/post.module.css';
import { string } from 'prop-types';
import { getURL } from '@amasty/blog-pro/src/utils';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';

const AuthorPosts = props => {
  const { url_key, name } = props;

  const classes = mergeClasses(defaultClasses, props.classes);
  const url = getURL(BLOG_URLS_BY_SECTION.AUTHOR, url_key);

  return (
    <div className={classes.authorPosts}>
      <Link to={url} className={classes.authorItem} title={name}>
        <span>More from this author</span>
      </Link>
    </div>
  );
};

AuthorPosts.propTypes = {
  url_key: string.isRequired,
  name: string
};

AuthorPosts.defaultProps = {
  url_key: ''
};

export default AuthorPosts;
