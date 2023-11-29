import classNames from 'classnames';
import React, { Fragment, Suspense, useMemo, useEffect, useState, useRef, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { LeftArrow, RightArrow } from '@app/components/Icons';
import JsonLd from '@app/components/JsonLd';
import { useNewArrivalsProducts } from '@app/components/NewArrivalsProducts/useNewArrivalsProducts';
import Breadcrumbs from '@app/components/overrides/Breadcrumbs';
import CurrentFilters from '@app/components/overrides/FilterModal/CurrentFilters';
import Gallery from '@app/components/overrides/Gallery';
import Pagination from '@app/components/overrides/Pagination/pagination';
import QuickFilter, { QuickFilterShimmer } from '@app/components/QuickFilter';
import ShimmerWrapper from '@app/components/ShimmerWrapper/shimmerWrapper';
import Slider from '@app/components/Slider';
import { useElementVisibility } from '@app/hooks/useElementVisibility';
import { useFiltersState } from '@app/hooks/useFiltersState';
import { useWindowSize } from '@magento/peregrine';
import { useIsInViewport } from '@magento/peregrine/lib/hooks/useIsInViewport';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import FilterModalOpenButton, {
    FilterModalOpenButtonShimmer
} from '@magento/venia-ui/lib/components/FilterModalOpenButton';
import { FilterSidebarShimmer } from '@magento/venia-ui/lib/components/FilterSidebar';
import { GalleryShimmer } from '@magento/venia-ui/lib/components/Gallery';
import { Link, Meta, Title } from '@magento/venia-ui/lib/components/Head';
import Icon from '@magento/venia-ui/lib/components/Icon';
import ProductSort, { ProductSortShimmer } from '@magento/venia-ui/lib/components/ProductSort';
import SortedByContainer, { SortedByContainerShimmer } from '@magento/venia-ui/lib/components/SortedByContainer';
import { GET_PAGE_SIZE } from '@magento/venia-ui/lib/RootComponents/Category/category.gql';

import defaultClasses from './shopByAttributeOption.module.css';
import { useShopByAttributeOption } from './useShopByAttributeOption';

const FilterModal = React.lazy(() => import('@app/components/overrides/FilterModal/filterModal'));
const FilterSidebar = React.lazy(() => import('@app/components/overrides/FilterSidebar'));

const ShopByAttributeOption = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        availableSortMethods,
        data,
        filters,
        loading,
        pageControl,
        sortProps,
        categoryChildren,
        optionData,
        richData,
        filterControl,
        canonicalUrl,
        hreflangLinks,
        searchFilters
    } = useShopByAttributeOption({
        ...props,
        ...{
            getPageSize: GET_PAGE_SIZE
        }
    });
    const [currentSort] = sortProps;
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

    filterControl.current = {
        handleApply,
        handleReset,
        handleKeyDownActions,
        handleClose
    };

    const { products } = useNewArrivalsProducts({ optionId: props.option_id });

    const isMobile = useWindowSize().innerWidth < 768;

    const filterRef = useRef(null);
    const sidebarRef = useRef(null);
    const headerButtonsRef = useRef();
    const categoryRef = useRef();
    const { isVisible: isHeaderButtonsVisible } = useElementVisibility({ element: headerButtonsRef.current });
    const { isVisible: isCategoryContentVisible } = useElementVisibility({ element: categoryRef.current });

    const shouldRenderSidebarContent = useIsInViewport({
        elementRef: sidebarRef
    });

    useEffect(() => {
        document.body.classList.add('attribute-page');
        return () => globalThis.document.body.classList.remove('attribute-page');
    }, []);

    const {
        title,
        description,
        meta_title,
        meta_description,
        meta_keywords,
        banner_path,
        cmsBlockBottom,
        isNewArrivals
    } = optionData;
    const cmsBlockBottomSplit = cmsBlockBottom ? cmsBlockBottom.split('|') : [];
    const filteredProducts = products?.filter(product => product.brand_name === title);

    const noNewArrivalProducts = filteredProducts?.length === 0;

    const arrivalsEnabled = isNewArrivals === '1';

    const content = useMemo(() => {
        if (!data && loading) {
            return (
                <Fragment>
                    <section className={classes.gallery}>
                        <GalleryShimmer items={Array.from({ length: 12 }).fill(null)} />
                    </section>
                    <section className={classes.pagination} />
                </Fragment>
            );
        }

        if (!data) {
            return null;
        }

        if (data.products.items.length === 0) {
            return (
                <div className={classes.noResult} data-cy="ShopByAttributeOptionPage-noResult">
                    <FormattedMessage
                        id="ShopByAttributeOptionPage.noResultImportant"
                        defaultMessage="No results found!"
                    />
                </div>
            );
        } else {
            return (
                <Fragment>
                    <section className={classes.gallery}>
                        <Gallery items={data.products.items} />
                    </section>
                    <section className={classes.pagination}>
                        <Pagination pageControl={pageControl} />
                    </section>
                </Fragment>
            );
        }
    }, [classes.gallery, classes.noResult, classes.pagination, loading, data, pageControl]);

    const productsCount = data?.products?.items?.length || 0;

    const shouldShowFilterButtons = filters && filters.length;
    const shouldShowFilterShimmer = filters === null || loading;

    // If there are no products we can hide the sort button.
    const shouldShowSortButtons = productsCount && availableSortMethods;
    const shouldShowSortShimmer = !productsCount && loading;

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

    const scrollIntoViewWithOffset = (element, offset) => {
        window.scrollTo({
            top: element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offset
        });
    };

    const handleApplyFilter = useCallback(
        (...args) => {
            const filterElement = filterRef.current;

            setTimeout(() => {
                scrollIntoViewWithOffset(filterElement, 0);
            }, 1000);

            handleApply(...args);
        },
        [handleApply, filterRef]
    );

    const clearAll = useMemo(() => {
        return filterState.size ? (
            <div className={classes.clearAll}>
                <button className={classes.clearAllButton} type="button" onClick={handleReset}>
                    <FormattedMessage id="filterModal.clearAll" defaultMessage="Clear filters" />
                </button>
            </div>
        ) : null;
    }, [classes.clearAll, classes.clearAllButton, filterState.size, handleReset]);

    const currentFilters = useMemo(() => {
        return filterState.size ? (
            <CurrentFilters
                filterApi={filterApi.filterApi}
                filterNames={filterNames}
                filterState={filterState}
                onRemove={handleApply}
                clearAll={clearAll}
            />
        ) : null;
    }, [clearAll, filterApi.filterApi, filterNames, filterState, handleApply]);

    const maybeFilterModal = shouldShowFilterButtons ? (
        <Suspense fallback={null}>
            <FilterModal
                isOpen={isOpen}
                handleClose={handleClose}
                handleKeyDownActions={handleKeyDownActions}
                filterApi={filterApi}
                filterItems={filterItems}
                filterNames={filterNames}
                filterState={filterState}
                handleApply={handleApplyFilter}
                handleReset={handleReset}
                filterCountToOpen={filters.length}
                currentFilters={currentFilters}
                clearAll={clearAll}
            />
        </Suspense>
    ) : null;

    const maybeSidebar = shouldShowFilterButtons ? (
        <Suspense fallback={null}>
            <FilterSidebar
                filterApi={filterApi}
                filterItems={filterItems}
                filterNames={filterNames}
                filterState={filterState}
                handleApply={handleApplyFilter}
                handleReset={handleReset}
                filterCountToOpen={filters.length}
                currentFilters={currentFilters}
                clearAll={clearAll}
            />
        </Suspense>
    ) : shouldShowFilterShimmer ? (
        <FilterSidebarShimmer />
    ) : null;

    const maybeQuickFilter = shouldShowSortButtons ? (
        <QuickFilter
            scrollToRef={filterRef}
            handleApplyFilter={handleApplyFilter}
            filterApi={filterApi}
            filterItems={filterItems}
            filterNames={filterNames}
            filterState={filterState}
            handleApply={handleApplyFilter}
            handleReset={handleReset}
            filterCountToOpen={filters.length}
        />
    ) : null;

    const maybeSortButton = shouldShowSortButtons ? (
        availableSortMethods && <ProductSort sortProps={sortProps} availableSortMethods={availableSortMethods} />
    ) : shouldShowSortShimmer ? (
        <ProductSortShimmer />
    ) : null;

    const maybeSortContainer = shouldShowSortButtons ? (
        <SortedByContainer classes={{ root: classes.sortedByRoot }} currentSort={currentSort} />
    ) : shouldShowSortShimmer ? (
        <SortedByContainerShimmer />
    ) : null;

    const metaLabel = meta_title ? meta_title : title;

    const CategoryDescriptionElement = ({ description, characterCount }) => {
        const [expanded, setExpanded] = useState(false);

        const expandIconClasses = expanded ? classes.expandIconHidden : classes.expandIcon;
        const shortenedDescription = description && description.slice(0, characterCount) + '...';

        const maybeDescriptionShort =
            description && description.length > characterCount ? (
                <div>
                    {shortenedDescription}
                    <span
                        className={expandIconClasses}
                        tabIndex={0}
                        role="button"
                        onKeyDown={() => setExpanded(prevState => !prevState)}
                        onClick={() => setExpanded(prevState => !prevState)}
                    >
                        <span className={classes.learnMore}>
                            Learn More About <span className={classes.learnAttribute}>{title}</span>
                        </span>
                    </span>
                </div>
            ) : (
                <div>{description}</div>
            );

        const maybeExpandedDescription = (
            <>
                <span
                    className={classes.expandIcon}
                    tabIndex={0}
                    role="button"
                    onKeyDown={() => setExpanded(prevState => !prevState)}
                    onClick={() => setExpanded(prevState => !prevState)}
                >
                    {description} <span className={classes.learnMore}>Show Less</span>
                </span>
            </>
        );

        return <div>{expanded ? maybeExpandedDescription : maybeDescriptionShort}</div>;
    };

    const sliderSettings = {
        slidesToShow: filteredProducts?.length > 1 ? 2 : 1,
        slidesToScroll: 1,
        centerMode: true,
        swipeToSlide: true,
        draggable: true,
        arrows: true,
        infinite: filteredProducts ? filteredProducts.length > 2 : false,
        prevArrow: <Icon src={LeftArrow} />,
        nextArrow: <Icon src={RightArrow} />,

        responsive: [
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                    draggable: true,
                    arrows: false,
                    centerMode: true
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerMode: false,
                    arrows: false
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    centerMode: true
                }
            },
            {
                breakpoint: 1192,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true
                }
            }
        ]
    };

    const JsonLdElements = Object.keys(richData).map(key => {
        if (richData[key] && key !== '__typename') {
            return <JsonLd key={key} data={richData[key]} />;
        }
    });

    const sidebarContent = shouldRenderSidebarContent ? (
        <div ref={sidebarRef} className={classes.sidebar}>
            <Suspense fallback={<FilterSidebarShimmer />}>{shouldRenderSidebarContent ? maybeSidebar : null}</Suspense>
        </div>
    ) : null;

    const canonicalLink = canonicalUrl && <Link rel="canonical" href={canonicalUrl} />;

    const hreflangLinksElement =
        hreflangLinks &&
        hreflangLinks.map(({ href, hreflang }) => {
            return <Link key={hreflang} rel="alternate" href={href} hreflang={hreflang} />;
        });

    return (
        <div>
            {canonicalLink}
            {hreflangLinksElement}
            <div
                className={classes.attributeBanner}
                style={{
                    backgroundImage: `url(${banner_path})`
                }}
            >
                <Breadcrumbs
                    classes={{
                        root: classes.breadcrumbRoot,
                        breadcrumbContainer: classes.breadcrumbContainer
                    }}
                    attributeoptionId={title}
                />

                <div className={classes.attributeTitle}>
                    <h1>{title}</h1>
                </div>
            </div>
            <div className={arrivalsEnabled ? classes.actionRow : classes.actionRowNoNewArrivals}>
                <div className={!arrivalsEnabled && !isMobile && classes.actionWhenNoArrivals}>
                    <div
                        className={
                            arrivalsEnabled ? classes.descriptionContainer : classes.descriptionContainerNoArrivals
                        }
                    >
                        <CategoryDescriptionElement characterCount={isMobile ? 100 : 158} description={description} />
                    </div>
                    <div className={classes.quickFilterContainer}>
                        {(categoryChildren === false && <QuickFilterShimmer />) || maybeQuickFilter}
                    </div>
                </div>

                {arrivalsEnabled && !noNewArrivalProducts ? (
                    <ShimmerWrapper
                        classes={{ root: classes.arrivalsShimmer }}
                        isShimmer={!products || products.length === 0}
                    >
                        <Slider
                            galleryItemClasses={{
                                reviews: classes.sliderItemReviews,
                                brandName: classes.sliderItemBrand
                            }}
                            classes={{
                                root: classes.sliderRoot,
                                slider: classes.newArrivalsSlider,
                                innerTitle: classes.newArrivalsSliderInnerrTitle
                            }}
                            products={filteredProducts}
                            propSettings={sliderSettings}
                            innerTitle="new arrivals"
                        />
                    </ShimmerWrapper>
                ) : null}
            </div>

            <article ref={filterRef} className={classes.root} data-cy="ShopByAttributeOptionPage-root">
                <div className={classes.contentWrapper}>
                    <div className={classes.heading}>
                        <div className={classes.headerButtons} ref={headerButtonsRef}>
                            {maybeSortButton}
                            {maybeFilterButtons}
                        </div>
                        <div className={classes.metaTitle}>{optionData.meta_title}</div>
                        {maybeSortContainer}
                    </div>
                    {sidebarContent}
                    <div className={classes.categoryContent} ref={categoryRef}>
                        {content}
                        {cmsBlockBottom && (
                            <div className={classes.cmsBlockContainer}>
                                <CmsBlock
                                    classes={{ content: classes.cmsBlockContent, root: classes.cmsBlockRoot }}
                                    identifiers={cmsBlockBottomSplit[0]}
                                />
                            </div>
                        )}

                        <Suspense fallback={null}>{maybeFilterModal}</Suspense>
                    </div>
                    <div
                        className={classNames(classes.filterButtonFixedContainer, {
                            [classes.filterButtonFixedHidden]: isHeaderButtonsVisible || !isCategoryContentVisible
                        })}
                    >
                        {maybeFilterButtons}
                    </div>
                </div>
                {JsonLdElements}
                <Title>{metaLabel}</Title>
                <Meta name="title" content={metaLabel} />
                <Meta name="description" content={meta_description} />
                <Meta name="keywords" content={meta_keywords} />
            </article>
        </div>
    );
};

export default ShopByAttributeOption;
