import { shape, string } from 'prop-types';
import React, { Fragment, useEffect } from 'react';

import BreadcrumbsShimmer from '@app/components/overrides/Breadcrumbs/breadcrumbs.shimmer';
import { FilterModalOpenButtonShimmer } from '@app/components/overrides/FilterModalOpenButton';
import { FilterSidebarShimmer } from '@app/components/overrides/FilterSidebar';
import { GalleryShimmer } from '@app/components/overrides/Gallery';
import { useDerivedClasses } from '@app/RootComponents/Category/useDerivedClasses';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { ProductSortShimmer } from '@magento/venia-ui/lib/components/ProductSort';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import { SortedByContainerShimmer } from '@magento/venia-ui/lib/components/SortedByContainer';

import defaultClasses from './category.module.css';

const CategoryContentShimmer = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { derivedClasses } = useDerivedClasses({
        classes
    });

    useEffect(() => {
        document.body.classList.add('category-page');
        return () => globalThis.document.body.classList.remove('category-page');
    }, []);

    const placeholderItems = Array.from({ length: 6 }).fill(null);

    return (
        <Fragment>
            <BreadcrumbsShimmer
                classes={{
                    breadcrumbContainer: classes.breadcrumbContainer,
                    root: derivedClasses.breadcrumbs,
                    breadcrumbShimmerRoot: classes.breadcrumbShimmerRoot
                }}
            />
            <div className={derivedClasses.header}>
                <div className={derivedClasses.headerContainer}>
                    <Shimmer classes={{ root_rectangle: classes.descriptionTitleShimmer }} />
                    <Shimmer classes={{ root_rectangle: classes.descriptionShimmer }} />
                </div>
            </div>
            <article className={classes.root}>
                <div className={classes.contentWrapper}>
                    <div className={classes.sidebar}>
                        <FilterSidebarShimmer />
                    </div>
                    <div className={classes.categoryContent}>
                        <div className={classes.heading}>
                            <div className={classes.categoryInfo}>
                                <Shimmer width={5} />
                            </div>
                            <div className={classes.headerButtons}>
                                <FilterModalOpenButtonShimmer />
                                <ProductSortShimmer />
                            </div>
                            <SortedByContainerShimmer />
                        </div>
                        <section className={classes.gallery}>
                            <GalleryShimmer items={placeholderItems} />
                        </section>
                    </div>
                </div>
            </article>
        </Fragment>
    );
};

CategoryContentShimmer.defaultProps = {
    classes: {}
};

CategoryContentShimmer.propTypes = {
    classes: shape({
        root: string,
        categoryHeader: string,
        title: string,
        categoryTitle: string,
        sidebar: string,
        categoryContent: string,
        heading: string,
        categoryInfo: string,
        headerButtons: string,
        gallery: string
    })
};

export default CategoryContentShimmer;
