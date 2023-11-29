import { PAGE_TYPES } from '@amasty/blog-pro/src/constants';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import GET_POSTS from '@amasty/blog-pro/src/queries/getPosts.graphql';
import GET_SEARCH_POSTS from '@amasty/blog-pro/src/queries/getSearchPosts.graphql';
import { useLazyQuery } from '@apollo/client';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { usePagination } from '@magento/peregrine';
import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';

const DEFAULT_PAGE_SIZE = 10; // Count post per page

export const useList = props => {
    const { id = 0 } = props;
    const { settings, pageType } = useAmBlogProContext();

    const isSearch = pageType === PAGE_TYPES.SEARCH;
    const query = isSearch ? GET_SEARCH_POSTS : GET_POSTS;

    const { list_count_per_page: pageSize = DEFAULT_PAGE_SIZE } = settings;

    const [runQuery, queryResponse] = useLazyQuery(query, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { loading, error, data, called } = queryResponse;

    const location = useLocation();

    const { amBlogPosts, amBlogPostsSearch } = data || {};
    const { items = [], all_post_size: postCount, hreflang_links: hreflangLinks, canonical_url: canonicalUrl } =
        amBlogPosts || amBlogPostsSearch || {};

    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    useEffect(() => {
        const pageCount = Math.ceil(postCount / pageSize);

        setTotalPages(pageCount);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, postCount, pageSize]);

    useEffect(() => {
        if (error && !loading && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [currentPage, error, loading, setCurrentPage]);

    useEffect(() => {
        const variables = {
            page: Number(currentPage),
            type: pageType,
            entityId: id
        };

        if (isSearch) {
            // Get the URL query parameters.
            const inputText = getSearchParam('query', location);
            variables.query = inputText;
        }

        runQuery({ variables });

        window.scrollTo({
            left: 0,
            top: 0,
            behavior: 'smooth'
        });
    }, [id, pageType, isSearch, currentPage, pageSize, runQuery, location]);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    return {
        loading: loading || !called,
        error,
        data,
        items,
        hreflangLinks,
        pageControl,
        canonicalUrl
    };
};
