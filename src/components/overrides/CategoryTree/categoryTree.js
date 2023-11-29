import { func, shape, string } from 'prop-types';
import React from 'react';

import { useCategoryTree } from '@magento/peregrine/lib/talons/CategoryTree';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Branch from './categoryBranch';
import Leaf from './categoryLeaf';
import defaultClasses from './categoryTree.module.css';

const Tree = ({ categoryId, setCategoryId, updateCategories, isTopLevel, onNavigate, ...props }) => {
    const talonProps = useCategoryTree({
        categoryId,
        updateCategories
    });

    const { data, childCategories, categoryUrlSuffix } = talonProps;
    const classes = useStyle(defaultClasses, props.classes);

    const branches = data
        ? Array.from(childCategories, childCategory => {
              const [id, { category }] = childCategory;
              const isBranch = category.menu_items.length > 0;
              const exclude = ['routines', 'new-arrivals'];

              return isBranch && !exclude.includes(category.url_path) ? (
                  <Branch
                      onNavigate={onNavigate}
                      categoryUrlSuffix={categoryUrlSuffix}
                      key={id}
                      category={category}
                      setCategoryId={setCategoryId}
                      isTopLevel={isTopLevel}
                  />
              ) : (
                  <Leaf key={id} category={category} onNavigate={onNavigate} />
              );
          })
        : null;

    return (
        <div className={classes.root} data-cy="CategoryTree-root">
            <div className={classes.tree}>{branches}</div>
        </div>
    );
};

export default Tree;

Tree.propTypes = {
    categoryId: string,
    classes: shape({
        root: string,
        tree: string
    }),
    onNavigate: func.isRequired,
    setCategoryId: func.isRequired,
    updateCategories: func.isRequired
};
