import React from 'react';
import PageBuilder from '@amasty/blog-pro/src/components/PageBuilder';
import AmBlogProProvider from '@amasty/blog-pro/src/context';

const Blog = () => {
  return (
    <AmBlogProProvider>
      <PageBuilder />
    </AmBlogProProvider>
  );
};

export default Blog;
