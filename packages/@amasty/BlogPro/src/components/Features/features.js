import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '@amasty/blog-pro/src/components/PostPage/post.module.css';
import Categories from '@amasty/blog-pro/src/components/Features/categories';
import Author from '@amasty/blog-pro/src/components/Features/author';
import ShortComments from '@amasty/blog-pro/src/components/Features/shortComments';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { number, string, shape } from 'prop-types';

const Features = props => {
  const { post, postUrl } = props;
  const { comment_count, author_id, categories: categoryIds } = post;
  const { settings } = useAmBlogProContext();
  const {
    post_display_author,
    post_display_categories,
    post_categories_limit,
    comments_use_comments
  } = settings;

  const { getAuthorById, getCategoriesByIds } = useAmBlogProContext();
  const author = getAuthorById(author_id);
  const categories = getCategoriesByIds(categoryIds);

  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <div className={classes.features}>
      {post_display_categories && (
        <Categories categories={categories} limit={post_categories_limit} />
      )}
      {post_display_author && author && <Author {...author} />}
      {comments_use_comments && (
        <ShortComments commentCount={comment_count} postUrl={postUrl} />
      )}
    </div>
  );
};

Features.propTypes = {
  postUrl: string,
  post: shape({
    comment_count: number,
    author_id: string,
    categories: string
  })
};

export default Features;
