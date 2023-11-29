import defaultClasses from '@amasty/blog-pro/src/components/PostPage/post.module.css';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { getURL } from '@amasty/blog-pro/src/utils';
import { string } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

const PostTags = props => {
    const { tagIds } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const { getTagsByIds } = useAmBlogProContext();
    const tags = getTagsByIds(tagIds);

    if (!tags || !tags.length) {
        return null;
    }

    const tagList = tags.map(({ tag_id, url_key, name }) => (
        <Link key={tag_id} className={classes.tagsItem} to={getURL(BLOG_URLS_BY_SECTION.TAG, url_key)} title={name}>
            {name}
        </Link>
    ));

    return (
        <div className={classes.tagsContainer}>
            <div className={classes.tags}>{tagList}</div>
        </div>
    );
};

PostTags.propTypes = {
    tagIds: string
};

PostTags.defaultProps = {
    tagIds: ''
};

export default PostTags;
