import Breadcrumbs from '@amasty/blog-pro/src/components/Breadcrumbs';
import List from '@amasty/blog-pro/src/components/List';
import defaultClasses from '@amasty/blog-pro/src/components/root.module.css';
import { PAGE_TYPES } from '@amasty/blog-pro/src/constants';
import { useListPage } from '@amasty/blog-pro/src/talons/useListPage';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { Redirect, useLocation } from 'react-router-dom';

import SearchBar from '../SearchBar';

import { BlogSearchIndex } from '@app/components/BlogSearch';
import BlogSearchTitle from '@app/components/BlogSearch/blogSearchTitle';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';

const ListPage = props => {
    const {
        itemId,
        name,
        meta_tags: metaTags,
        meta_title: metaTitle,
        meta_description: metaDescription,
        pageType
    } = useListPage();
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const { pathname } = useLocation();
    const [prevPath, setPrevPath] = useState(pathname);

    const focusDiv = useRef(null);

    useEffect(() => {
        if (prevPath !== pathname) {
            setPrevPath(pathname);
            if (isSearchOpen) {
                setIsSearchOpen(false);
            }
        }
    }, [pathname, setPrevPath, setIsSearchOpen, isSearchOpen, prevPath]);

    useEffect(() => {
        setTimeout(() => {
            if (focusDiv && focusDiv.current)
                focusDiv.current.scrollIntoView({
                    behavior: 'smooth'
                });
        }, 0);
    }, [pathname, focusDiv]);

    if (!itemId && pageType !== PAGE_TYPES.SEARCH) {
        return <Redirect to="/404.html" />;
    }

    const classes = mergeClasses(defaultClasses, props.classes);

    return (
        <Fragment>
            <Title>{metaTitle || name}</Title>
            <Meta name="description" content={metaDescription} />
            <Meta name="tags" content={metaTags} />
            <Breadcrumbs pageTitle={name} classes={{ gridArea: classes.breadcrumbs }} />

            <SearchBar setIsSearchOpen={setIsSearchOpen} />

            <BlogSearchIndex>
                <h2 ref={focusDiv} className={classes.heading}>
                    {(!isSearchOpen && name) || <BlogSearchTitle />}
                </h2>
                <List id={itemId} isSearchOpen={isSearchOpen} />
            </BlogSearchIndex>
        </Fragment>
    );
};

export default ListPage;
