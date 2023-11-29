import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../PostPage/post.module.css';
import { Link } from 'react-router-dom';
import { string } from 'prop-types';
import { getURL } from '@amasty/blog-pro/src/utils';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';

const Author = props => {
  const { name, url_key } = props;
  const classes = mergeClasses(defaultClasses, props.classes);
  const url = getURL(BLOG_URLS_BY_SECTION.AUTHOR, url_key);

  return (
    <div className={classes.author}>
      <span className={classes.authorIcon} />
      <span className={classes.featuresLabel}>By</span>
      <Link to={url} className={classes.authorItem} title={name}>
        {name}
      </Link>
    </div>
  );
};

Author.propTypes = {
  name: string.isRequired
};

Author.defaultProps = {
  name: ''
};

export default Author;
