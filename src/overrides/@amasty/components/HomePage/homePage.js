import Breadcrumbs from '@amasty/blog-pro/src/components/Breadcrumbs';
import List from '@amasty/blog-pro/src/components/List';
import defaultClasses from '@amasty/blog-pro/src/components/root.module.css';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import React, { Fragment, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import SearchBar from '../SearchBar';

import { BlogSearchIndex } from '@app/components/BlogSearch';
import BlogSearchTitle from '@app/components/BlogSearch/blogSearchTitle';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Meta, Title } from '@magento/venia-ui/lib/components/Head';

const HomePage = props => {
    const { settings, blogTitle } = useAmBlogProContext();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const {
        search_engine_meta_title,
        search_engine_meta_description,
        search_engine_meta_keywords,
        search_engine_bread
    } = settings || {};

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <Title>{search_engine_meta_title || blogTitle}</Title>
            <Meta name="description" content={search_engine_meta_description} />
            <Meta name="keywords" content={search_engine_meta_keywords} />

            <Breadcrumbs pageTitle={search_engine_bread || blogTitle} />
            <SearchBar setIsSearchOpen={setIsSearchOpen} />

            <BlogSearchIndex>
                <div className={classes.heading}>
                    <h2>
                        {!isSearchOpen && <FormattedMessage id="blogPage.allArticles" defaultMessage="All Articles" />}
                        {isSearchOpen && <BlogSearchTitle />}
                    </h2>
                </div>
                <List isSearchOpen={isSearchOpen} />
            </BlogSearchIndex>
        </Fragment>
    );
};

export default HomePage;
