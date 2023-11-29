import GET_POST from '@amasty/blog-pro/src/queries/getPost.graphql';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import GET_POST_RELATED_PRODUCTS from '../queries/getPostRelatedProducts.graphql';

export const usePost = () => {
    const { slug } = useParams();

    const [runQuery, queryResponse] = useLazyQuery(GET_POST, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { loading = true, error, data } = queryResponse;

    const [runRelatedProductsQuery, relatedProductsResponse] = useLazyQuery(GET_POST_RELATED_PRODUCTS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { loading: relatedProductsLoading, data: relatedProductsData } = relatedProductsResponse;

    useEffect(() => {
        if (!data) return;

        const variables = {
            postId: data.amBlogPost.post_id
        };

        runRelatedProductsQuery({ variables });
    }, [data, runRelatedProductsQuery]);

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

    const { amBlogPost } = data || {};
    const relatedProducts = relatedProductsData ? relatedProductsData.amBlogPostRelatedProducts.items : null;

    return {
        loading,
        error,
        post: amBlogPost,
        relatedProductsLoading,
        relatedProducts
    };
};
