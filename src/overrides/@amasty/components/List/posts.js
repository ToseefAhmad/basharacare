import Post from '@amasty/blog-pro/src/components/List/post';
import classNames from 'classnames';
import React from 'react';

import BlogSearch from '@app/components/BlogSearch';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Pagination from '@magento/venia-ui/lib/components/Pagination';

import defaultClasses from './list.module.css';

const Posts = props => {
    const { items, pageControl, isSearchOpen } = props;

    const classes = mergeClasses(defaultClasses, props.classes);

    const posts = items.map(item => <Post post={item} key={item.post_id} classes={{ root: classes.post }} />);

    return (
        <div className={classes.gridRoot}>
            <BlogSearch isSearchOpen={isSearchOpen} />
            <div className={classNames({ [classes.hidden]: isSearchOpen })}>
                <div className={classes.posts}>{posts}</div>
                <Pagination classes={{ root: classes.pagination }} pageControl={pageControl} />
            </div>
        </div>
    );
};

export default Posts;
