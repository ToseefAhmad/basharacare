import AmBlogProProvider from '@amasty/blog-pro/src/context';
import React, { lazy } from 'react';

const components = {
    tags: lazy(() => import('@amasty/blog-pro/src/components/Tags')),
    'featured-posts': lazy(() => import('@amasty/blog-pro/src/components/FeaturedPosts')),
    'recent-comments': lazy(() => import('@amasty/blog-pro/src/components/RecentComments')),
    'recent-posts': lazy(() => import('@app/components/RecentPostsSlider'))
};

const AmblogWidget = props => {
    const Component = props.type ? components[props.type] : null;
    return (
        Component && (
            <AmBlogProProvider>
                <Component {...props} />
            </AmBlogProProvider>
        )
    );
};

export default AmblogWidget;
