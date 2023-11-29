import { useEffect, useLayoutEffect } from 'react';
import GET_POST from '@amasty/blog-pro/src/queries/getPost.graphql';
import { useLazyQuery } from '@apollo/client';
import { useParams, useLocation } from 'react-router-dom';

export const usePost = props => {
  const { commentsRef } = props;
  const location = useLocation();
  const { slug } = useParams();

  const [runQuery, queryResponse] = useLazyQuery(GET_POST, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first'
  });

  const { loading = true, error, data } = queryResponse;

  useEffect(() => {
    const variables = {
      urlKey: slug
    };
    runQuery({ variables });

    window.scrollTo({
      left: 0,
      top: 0
    });
  }, [slug, runQuery]);

  useLayoutEffect(() => {
    const { current: el } = commentsRef;

    if (el && location.hash.includes('#comments')) {
      el.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
        inline: 'center'
      });
    }
  }, [commentsRef, location, data, loading, error]);

  const { amBlogPost } = data || {};

  return {
    loading,
    error,
    post: amBlogPost
  };
};
