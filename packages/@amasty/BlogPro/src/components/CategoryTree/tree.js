import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { array } from 'prop-types';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './categoryTree.module.css';
import { getURL } from '@amasty/blog-pro/src/utils';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';

const Tree = props => {
  const { categories } = props;

  const sortedCategories = useMemo(
    () =>
      categories
        ? categories.sort((a, b) => a.sort_order - b.sort_order)
        : null,
    [categories]
  );

  if (!categories || !categories.length) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <ul className={classes.tree}>
      {sortedCategories.map(item => (
        <li
          key={item.category_id}
          className={`${classes.node} level-${item.level}`}
        >
          <Link
            to={getURL(BLOG_URLS_BY_SECTION.CATEGORY, item.url_key)}
            className={classes.link}
          >
            <span className={classes.name}>{item.name}</span>
            <span className={classes.count}>({item.post_count || 0})</span>
          </Link>
          {item.children && <Tree categories={item.children} />}
        </li>
      ))}
    </ul>
  );
};

Tree.propTypes = {
  categories: array.isRequired
};

Tree.defaultProps = {
  categories: []
};

export default Tree;
