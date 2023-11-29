import React, { lazy, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { PAGE_TYPES } from '@amasty/blog-pro/src/constants';

const Home = lazy(() => import('@amasty/blog-pro/src/components/HomePage'));
const Post = lazy(() => import('@amasty/blog-pro/src/components/PostPage'));
const ListPage = lazy(() => import('@amasty/blog-pro/src/components/ListPage'));

const MainContent = () => {
  const { slug } = useParams();

  const Page = useMemo(() => {
    if (!slug) {
      return Home;
    }

    return PAGE_TYPES[slug.toUpperCase()] ? ListPage : Post;
  }, [slug]);

  return <Page />;
};

export default MainContent;
