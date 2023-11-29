import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './list.module.css';
import Pagination from '@magento/venia-ui/lib/components/Pagination';
import Post from '@amasty/blog-pro/src/components/List/post';

const Posts = props => {
  const { items, pageControl } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  const posts = items.map(item => (
    <Post post={item} key={item.post_id} classes={{ root: classes.post }} />
  ));

  return (
    <div className={classes.root}>
      <div className={classes.posts}>{posts}</div>

      <Pagination
        classes={{ root: classes.pagination }}
        pageControl={pageControl}
      />
    </div>
  );
};

export default Posts;
