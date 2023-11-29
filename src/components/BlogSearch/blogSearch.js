import classNames from 'classnames';
import { bool, func } from 'prop-types';
import React from 'react';

import BlogHits from './blogHits';
import classes from './blogSearch.module.css';

const BlogSearch = ({ isSearchOpen }) => {
    return (
        <div
            className={classNames({
                [classes.hidden]: !isSearchOpen
            })}
        >
            <BlogHits />
        </div>
    );
};

BlogSearch.propTypes = {
    setIsSearchOpen: func,
    isSearchOpen: bool
};

export default BlogSearch;
