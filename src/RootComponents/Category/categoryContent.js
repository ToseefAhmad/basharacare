import classNames from 'classnames';
import React, { Fragment, Suspense, useMemo, useRef, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import Breadcrumbs from '@app/components/overrides/Breadcrumbs';
import CurrentFilters from '@app/components/overrides/FilterModal/CurrentFilters';
import FilterModalOpenButton, { FilterModalOpenButtonShimmer } from '@app/components/overrides/FilterModalOpenButton';
import { FilterSidebarShimmer } from '@app/components/overrides/FilterSidebar';
import Gallery, { GalleryShimmer } from '@app/components/overrides/Gallery';
import Pagination from '@app/components/overrides/Pagination/pagination';
import ProductSort from '@app/components/overrides/ProductSort/productSort';
import ProductSortShimmer from '@app/components/overrides/ProductSort/productSort.shimmer';
import { useElementVisibility } from '@app/hooks/useElementVisibility';
import { useFiltersState } from '@app/hooks/useFiltersState';
import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';
import SortedByContainer, { SortedByContainerShimmer } from '@magento/venia-ui/lib/components/SortedByContainer';
import NoProductsFound from '@magento/venia-ui/lib/RootComponents/Category/NoProductsFound';

import { useCategoryContent } from './useCategoryContent';

const FilterModal = React.lazy(() => import('@app/components/overrides/FilterModal/filterModal'));
const FilterSidebar = React.lazy(() => import('@app/components/overrides/FilterSidebar'));

const CategoryContent = ({
    classes,
    categoryId,
    category,
    products,
    aggregations,
    isLoading,
    pageControl,
    sortProps,
    pageSize,
    metaTitle,
    searchFilters
}) => {
    const [currentSort] = sortProps;

    useEffect(() => {
        document.body.classList.add('category-page');
        return () => globalThis.document.body.classList.remove('category-page');
    }, []);

    const {
        availableSortMethods,
        categoryName,
        categoryDescription,
        filters,
        items,
        handleProductClick,
        derivedClasses
    } = useCategoryContent({
        classes,
        categoryId,
        category,
        products,
        aggregations,
        isLoading,
        pageSize,
        searchFilters
    });

    const {
        filterItems,
        filterState,
        filterNames,
        filterApi,
        handleApply,
        handleReset,
        handleKeyDownActions,
        handleClose,
        isOpen
    } = useFiltersState({
        filters,
        searchFilters
    });

    const headerButtonsRef = useRef();
    const categoryRef = useRef();

    const { isVisible: isHeaderButtonsVisible } = useElementVisibility({ element: headerButtonsRef.current });
    const { isVisible: isCategoryContentVisible } = useElementVisibility({ element: categoryRef.current });

    const sidebarRef = useRef(null);
    const shouldRenderSidebarContent = useIsInViewport({
        elementRef: sidebarRef
    });

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = !filters || isLoading;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = pageControl.totalPages && availableSortMethods;
    const shouldShowSortShimmer = !pageControl.totalPages && isLoading;
    const maybeFilterButtons = shouldShowFilterButtons ? (
        <FilterModalOpenButton
            filters={filters}
            classes={
                !isHeaderButtonsVisible
                    ? {
                          filterButton: classes.filterButtonFixed
                      }
                    : {}
            }
            searchFilters={searchFilters}
        />
    ) : shouldShowFilterShimmer ? (
        <FilterModalOpenButtonShimmer />
    ) : null;

    const clearAll = filterState.size ? (
        <div className={classes.clearAll}>
            <button className={classes.clearAllButton} type="button" onClick={handleReset}>
                <FormattedMessage id="filterModal.clearAll" defaultMessage="Clear filters" />
            </button>
        </div>
    ) : null;

    const currentFilters = (
        <CurrentFilters
            filterApi={filterApi.filterApi}
            filterNames={filterNames}
            filterState={filterState}
            onRemove={handleApply}
            clearAll={clearAll}
        />
    );

    const filtersModal =
        shouldShowFilterButtons && searchFilters ? (
            <FilterModal
                isOpen={isOpen}
                handleClose={handleClose}
                handleKeyDownActions={handleKeyDownActions}
                filterApi={filterApi}
                filterItems={filterItems}
                filterNames={filterNames}
                filterState={filterState}
                handleApply={handleApply}
                handleReset={handleReset}
                filterCountToOpen={filters.length}
                currentFilters={currentFilters}
                clearAll={clearAll}
            />
        ) : null;

    const sidebar = shouldShowFilterButtons ? (
        <FilterSidebar
            filterApi={filterApi}
            filterItems={filterItems}
            filterNames={filterNames}
            filterState={filterState}
            handleApply={handleApply}
            handleReset={handleReset}
            filterCountToOpen={filters.length}
            currentFilters={currentFilters}
            clearAll={clearAll}
        />
    ) : shouldShowFilterShimmer ? (
        <FilterSidebarShimmer />
    ) : null;

    const maybeSortButton = shouldShowSortButtons ? (
        <ProductSort sortProps={sortProps} availableSortMethods={availableSortMethods} />
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

    const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer classes={{ root: classes.sortedByRoot }} currentSort={currentSort} />
    ) : shouldShowSortShimmer ? (
        <SortedByContainerShimmer />
    ) : null;

    const content = useMemo(() => {
        if (!pageControl.totalPages && !isLoading) {
            return <NoProductsFound categoryId={categoryId} />;
        }

        const gallery =
            pageControl.totalPages && !isLoading ? (
                <Gallery items={items} onItemClick={handleProductClick} />
            ) : (
                <GalleryShimmer items={items} />
            );

        const pagination = pageControl.totalPages ? <Pagination pageControl={pageControl} /> : null;

        return (
            <Fragment>
                <section className={classes.gallery}>{gallery}</section>
                <div className={classes.pagination}>{pagination}</div>
            </Fragment>
        );
    }, [categoryId, classes.gallery, classes.pagination, handleProductClick, isLoading, items, pageControl]);

    const sidebarContent = shouldRenderSidebarContent ? (
        <div ref={sidebarRef} className={classes.sidebar}>
            <Suspense fallback={<FilterSidebarShimmer />}>{shouldRenderSidebarContent ? sidebar : null}</Suspense>
        </div>
    ) : null;

    const CategoryDescriptionElement = ({ description, characterCount }) => {
        const [expanded, setExpanded] = useState(false);

        const shortDescription = description => {
            if (description.length < 100) return description + '<<';

            return description.substr(0, characterCount - 6) + '... >>';
        };

        const maybeDescriptionShort =
            description && description.length > characterCount ? (
                <div
                    className={classes.categoryShortDescription}
                    tabIndex={0}
                    role="button"
                    onKeyDown={() => setExpanded(prevState => !prevState)}
                    onClick={() => setExpanded(prevState => !prevState)}
                >
                    <RichContent html={shortDescription(description)} />
                </div>
            ) : (
                <div className={classes.categoryDescription}>
                    <RichContent html={description} />
                </div>
            );

        const maybeExpandedDescription = (
            <div
                className={classes.categoryDescription}
                tabIndex={0}
                role="button"
                onKeyDown={() => setExpanded(prevState => !prevState)}
                onClick={() => setExpanded(prevState => !prevState)}
            >
                <RichContent html={description + '<<'} />
            </div>
        );

        return <div>{expanded ? maybeExpandedDescription : maybeDescriptionShort}</div>;
    };

    const categoryHeaderBanner = (
        <div className={derivedClasses.header}>
            <div className={derivedClasses.headerContainer}>
                {!categoryName ? (
                    <Shimmer classes={{ root_rectangle: classes.descriptionTitleShimmer }} />
                ) : (
                    <h1 className={classes.title}>
                        <div className={classes.categoryTitle}>
                            {category.name.split(' ').map(i => (
                                <span key={i}>{i}</span>
                            ))}
                            <div className={derivedClasses.icon} />
                        </div>
                    </h1>
                )}
                {!categoryDescription ? (
                    <Shimmer classes={{ root_rectangle: classes.descriptionShimmer }} />
                ) : (
                    <CategoryDescriptionElement characterCount={100} description={categoryDescription} />
                )}
            </div>
        </div>
    );

    return (
        <Fragment>
            <Breadcrumbs
                classes={{
                    breadcrumbContainer: classes.breadcrumbContainer,
                    root: derivedClasses.breadcrumbs,
                    breadcrumbShimmerRoot: classes.breadcrumbShimmerRoot
                }}
                categoryId={category?.uid || null}
                showShimmer={!category}
            />
            {categoryHeaderBanner}
            <article className={classes.root} data-cy="CategoryContent-root">
                <div className={classes.contentWrapper}>
                    <div className={classes.heading}>
                        <div className={classes.headerButtons} ref={headerButtonsRef}>
                            {maybeSortButton}
                            {maybeFilterButtons}
                        </div>
                        <div className={classes.metaTitle}>{metaTitle}</div>
                        {maybeSortContainer}
                    </div>
                    {sidebarContent}
                    <div className={classes.categoryContent} ref={categoryRef}>
                        {content}
                        <Suspense fallback={null}>{filtersModal}</Suspense>
                    </div>
                    <div
                        className={classNames(classes.filterButtonFixedContainer, {
                            [classes.filterButtonFixedHidden]: isHeaderButtonsVisible || !isCategoryContentVisible
                        })}
                    >
                        {maybeFilterButtons}
                    </div>
                </div>
            </article>
        </Fragment>
    );
};

export default CategoryContent;
