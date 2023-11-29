import { PAGE_TYPES } from '@amasty/blog-pro/src/constants';
import { useList } from '@amasty/blog-pro/src/talons/useList';
import { usePageBuilder } from '@amasty/blog-pro/src/talons/usePagebuilder';
import { bool, string } from 'prop-types';
import React, { Fragment } from 'react';

import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Link } from '@magento/venia-ui/lib/components/Head';

import defaultClasses from './list.module.css';
import ListShimmer from './list.shimmer.js';
import Posts from './posts';

const NO_ITEMS_MESSAGE = 'There are no posts yet.';
const storage = new BrowserPersistence();

const List = props => {
    const { id, isSearchOpen } = props;
    const { loading, error, items, pageControl, hreflangLinks, canonicalUrl } = useList({
        id
    });
    const classes = mergeClasses(defaultClasses, props.classes);
    const { sections } = usePageBuilder();
    const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;

    const { main } = sections || {};

    if (loading) {
        return <ListShimmer />;
    }

    const hasGrid = main.includes('grid');
    const hasList = main.includes('list');

    if (error || !items || !items.length) {
        return (
            <div className={`${hasList && classes.root} ${hasGrid && classes.gridRoot}`}>
                <p className={classes.noItems}>{NO_ITEMS_MESSAGE}</p>
            </div>
        );
    }

    const hreflangLinksElement = hreflangLinks
        ? hreflangLinks.map(({ href, hreflang }) => {
              return <Link key={hreflang} rel="alternate" href={href} hreflang={hreflang} />;
          })
        : null;

    const canonicalUrlLink = `${origin}/${storeCode}${canonicalUrl}`;
    const canonicalUrlElement = canonicalUrl ? <Link rel="canonical" href={canonicalUrlLink} /> : null;

    return (
        <Fragment>
            {hreflangLinksElement}
            {canonicalUrlElement}
            {hasList && <Posts items={items} pageControl={pageControl} isSearchOpen={isSearchOpen} />}
            {hasGrid && <Posts items={items} pageControl={pageControl} isSearchOpen={isSearchOpen} />}
        </Fragment>
    );
};

List.propTypes = {
    pageType: string,
    isSearchOpen: bool
};

List.defaultProps = {
    pageType: PAGE_TYPES.ALL,
    isSearchOpen: false
};

export default List;
