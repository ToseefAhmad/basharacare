import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { string } from 'prop-types';
import React, { Fragment } from 'react';
import { useLocation, Link } from 'react-router-dom';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './breadcrumbs.module.css';

const Breadcrumbs = ({ pageTitle, postPage, classes: propClasses }) => {
    const { blogTitle, settings } = useAmBlogProContext();
    const classes = mergeClasses(defaultClasses, propClasses);
    const { pathname } = useLocation();
    const { search_engine_bread } = settings;

    const cmsBlockShimmer = (
        <div className={classes.bannerShimmer}>
            <Shimmer width="100%" height={30} key="blogPage.banner" />
        </div>
    );

    const links =
        pathname.replace(/\.html\/?$/, '') !== BLOG_URLS_BY_SECTION.HOME ? (
            <Fragment>
                <span className={classes.divider}>/</span>
                <Link className={classes.link} to="/blog">
                    {search_engine_bread || blogTitle}
                </Link>
            </Fragment>
        ) : null;

    return (
        <div className={classes.root}>
            <div className={classes.breadcrumbsContainer}>
                <Link className={classes.link} to="/">
                    Home
                </Link>
                {links}
                <span className={classes.divider}>/</span>
                <span className={classes.text}>{pageTitle}</span>
            </div>
            {!postPage ? (
                <CmsBlock classes={{ root: classes.banner }} identifiers="blog-main-banner" shimmer={cmsBlockShimmer} />
            ) : null}
        </div>
    );
};

Breadcrumbs.propTypes = {
    pageTitle: string
};

Breadcrumbs.defaultProps = {
    pageTitle: ''
};

export default Breadcrumbs;
