import { DEFAULT_BLOG_TITLE, PAGE_TYPES } from '@amasty/blog-pro/src/constants';
import { useQuery } from '@apollo/client';
import { useMemo } from 'react';
import { useParams } from 'react-router-dom';

const getItemByUrlKey = (urlKey, items) => {
    const list = Array.isArray(items) ? items : [];
    return list.find(({ url_key }) => url_key === urlKey);
};

export const useBlog = props => {
    const { query } = props;
    const { slug } = useParams();

    const pageType = useMemo(() => {
        return slug ? PAGE_TYPES[slug.toUpperCase()] || PAGE_TYPES.POST : PAGE_TYPES.ALL;
    }, [slug]);

    const { loading, error, data } = useQuery(query, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const { amBlogSetting: settings, amBlogCategories, amBlogAuthors, amBlogTags } = data || {};

    const { items: authors = [] } = amBlogAuthors || {};
    const { items: categories = [] } = amBlogCategories || {};
    const { items: tags = [] } = amBlogTags || {};

    const getAuthorById = id => {
        const authorList = Array.isArray(authors) ? authors : [];

        return authorList.find(({ author_id }) => Number(author_id) === Number(id));
    };

    const getTagsByIds = (ids = []) => {
        const tagList = Array.isArray(tags) ? tags : [];

        return tagList.filter(({ tag_id }) => {
            const idList = ids.toString().split(',');
            return idList.some(id => Number(id) === Number(tag_id));
        });
    };

    const getCategoriesByIds = (ids = []) => {
        const list = Array.isArray(categories) ? categories : [];

        return list.filter(({ category_id }) => {
            const idList = ids.toString().split(',');
            return idList.some(id => Number(id) === Number(category_id));
        });
    };

    const { search_engine_title } = settings || {};

    return {
        error,
        loading,
        settings,
        categories,
        tags,
        authors,
        getAuthorById,
        getTagsByIds,
        getCategoriesByIds,
        getCategoryByUrlKey: urlKey => getItemByUrlKey(urlKey, categories),
        getTagByUrlKey: urlKey => getItemByUrlKey(urlKey, tags),
        getAuthorByUrlKey: urlKey => getItemByUrlKey(urlKey, authors),
        blogTitle: search_engine_title || DEFAULT_BLOG_TITLE,
        pageType
    };
};
