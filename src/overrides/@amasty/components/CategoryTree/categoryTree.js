import Tree from '@amasty/blog-pro/src/components/CategoryTree/tree';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { useAccordion } from '@amasty/blog-pro/src/talons/useAccordion';
import { buildTree } from '@amasty/blog-pro/src/utils';
import { array, bool, string } from 'prop-types';
import React, { useMemo } from 'react';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './categoryTree.module.css';

const CategoryTree = props => {
    const { categories, loading } = useAmBlogProContext() || {};

    const { accordionEnabled } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const categoriesTree = useMemo(() => {
        if (!Array.isArray(categories) || !categories.length) {
            return null;
        }

        return buildTree({ items: categories });
    }, [categories]);

    const { isOpen } = useAccordion({ accordionEnabled });

    if (loading) {
        return (
            <div className={classes.shimmerBlock}>
                <Shimmer width="100%" height={1.5} key="category-filters" />
            </div>
        );
    }

    return (
        <div className={`${classes.root} ${classes.gridArea}`}>
            {isOpen && <Tree categories={categoriesTree} classes={classes} />}
        </div>
    );
};

CategoryTree.propTypes = {
    categories: array,
    title: string,
    accordionEnabled: bool
};

CategoryTree.defaultProps = {
    categories: [],
    title: 'Categories',
    accordionEnabled: false
};

export default CategoryTree;
