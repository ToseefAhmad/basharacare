import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../PostPage/post.module.css';
import { Link } from 'react-router-dom';
import { number, string } from 'prop-types';
import { getURL } from '@amasty/blog-pro/src/utils';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';

const Categories = props => {
  const { categories, limit } = props;

  if (!categories || !categories.length) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const content = categories.map(({ category_id, url_key, name }, index) => {
    if (limit && index > limit - 1) {
      return null;
    }
    const url = getURL(BLOG_URLS_BY_SECTION.CATEGORY, url_key);
    return (
      <Link
        key={category_id}
        to={url}
        title={name}
        className={classes.categoriesItem}
      >
        {name}
      </Link>
    );
  });

  return (
    <div className={classes.categories}>
      <span className={classes.featuresLabel}>Posted in:</span>
      <div className={classes.categoriesList}>{content}</div>
    </div>
  );
};

Categories.propTypes = {
  string: string.isRequired,
  limit: number
};

Categories.defaultProps = {
  string: '',
  limit: 5
};

export default Categories;
