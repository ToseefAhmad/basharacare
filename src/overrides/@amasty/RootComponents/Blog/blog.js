import PageBuilder from '@amasty/blog-pro/src/components/PageBuilder';
import AmBlogProProvider from '@amasty/blog-pro/src/context';
import React, { useEffect } from 'react';

const Blog = () => {
    useEffect(() => {
        document.body.classList.add('blog-page');
        return () => globalThis.document.body.classList.remove('blog-page');
    }, []);

    return (
        <AmBlogProProvider>
            <PageBuilder />
        </AmBlogProProvider>
    );
};

export default Blog;
