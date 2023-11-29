import React from 'react';

import { BlogSearchBox } from '@app/components/BlogSearch';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './searchBar.module.css';

const SearchBar = props => {
    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <div className={classes.filterContainer}>
                <div className={classes.filterTypes}>
                    <BlogSearchBox setIsSearchOpen={props.setIsSearchOpen} />
                </div>
            </div>
        </div>
    );
};

export default SearchBar;
