import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { getURL } from '@amasty/blog-pro/src/utils';
import { array } from 'prop-types';
import React, { useMemo } from 'react';
import { X as closeIcon } from 'react-feather';
import { Link, useLocation } from 'react-router-dom';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './categoryTree.module.css';

const Tree = props => {
    const { categories } = props;

    const sortedCategories = useMemo(
        () => (categories ? categories.sort((a, b) => a.sort_order - b.sort_order) : null),
        [categories]
    );

    const classes = mergeClasses(defaultClasses, props.classes);

    const sampleLocation = useLocation();

    if (!categories || !categories.length) {
        return null;
    }

    return (
        <ul className={classes.tree}>
            {sortedCategories.map(item => {
                const urlTo = getURL(BLOG_URLS_BY_SECTION.CATEGORY, item.url_key);
                const isOpened = sampleLocation.pathname === urlTo;

                return (
                    <div key={item.category_id}>
                        <li className={isOpened ? classes.itemActive : classes.itemInactive}>
                            <Link to={urlTo} className={isOpened ? classes.linkTextOpened : classes.linkText}>
                                <span className={classes.name}>{item.name}</span>
                            </Link>
                            {isOpened ? (
                                <Link to={getURL('/blog')}>
                                    <Icon classes={{ icon: classes.linkIcon }} src={closeIcon} size={12} />
                                </Link>
                            ) : null}
                            {item.children && <Tree categories={item.children} />}
                        </li>
                    </div>
                );
            })}
        </ul>
    );
};

Tree.propTypes = {
    categories: array.isRequired
};

Tree.defaultProps = {
    categories: []
};

export default Tree;
