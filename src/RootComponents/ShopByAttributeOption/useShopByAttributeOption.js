import { useLazyQuery, useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useLocation } from 'react-router-dom';

import { useSort } from '@app/components/overrides/ProductSort/useSort';
import { useRouteDataContext } from '@app/context/RouteData';
import { useFilters, isEnabledFilterByCategory } from '@app/hooks/useFilters';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import { getSearchParam } from '@magento/peregrine/lib/hooks/useSearchParam';
import { getFilterInput, getFiltersFromSearch } from '@magento/peregrine/lib/talons/FilterModal/helpers';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const defaultSort = {
    sortText: 'Best Sellers',
    sortId: 'sortItem.bestsellers',
    sortAttribute: 'bestsellers',
    sortDirection: 'DESC'
};

import DEFAULT_OPERATIONS from './shopByAttributeOption.gql';

/**
 *
 * @param props
 * @returns {{availableSortMethods: *, shopByAttributeOption: *, openDrawer: ((function(): void)|*), data: any, sortProps: [{sortDirection: string, sortAttribute: string, sortText: string},React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}>>], pageSize: (any), filters: ([]|*), error: ApolloError, loading: boolean, categoryChildren: unknown, pageControl: {totalPages, currentPage, setPage}}}
 */
export const useShopByAttributeOption = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const {
        getFilterInputsQuery,
        getShopByAttributeOptionDataQuery,
        getShopByAttributeOptionSettingQuery
    } = operations;

    const [{ routeData }] = useRouteDataContext();

    const { data: settingData, called: settingDataCalled, loading: settingDataLoading } = useQuery(
        getShopByAttributeOptionSettingQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: {
                optionId: props.option_id
            }
        }
    );

    const attributeCode = routeData?.filter_code?.replace('attr_', '') || null;

    const { data: pageSizeData } = useQuery(props.getPageSize, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    const pageSize = pageSizeData && pageSizeData.storeConfig.grid_per_page;

    const sortProps = useSort({ defaultSort });
    const [currentSort] = sortProps;
    const { sortAttribute, sortDirection } = currentSort;
    // Keep track of the sort criteria So we can tell when they change.
    const previousSort = useRef(currentSort);

    // Get the URL query parameters.
    const { search } = useLocation();
    // Keep track of the search terms So we can tell when they change.
    const previousSearch = useRef(search);

    const currentCategoryUrl = routeData?.url_alias || '';

    // Set up pagination.
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;

    // Retrieve app state and action creators
    const [, appApi] = useAppContext();
    const {
        toggleDrawer,
        actions: { setPageLoading }
    } = appApi;

    const inputText = getSearchParam('query', location);

    const openDrawer = useCallback(() => {
        toggleDrawer('filter');
    }, [toggleDrawer]);

    // Get "allowed" filters by intersection of schema and aggregations
    const { called: introspectionCalled, data: introspectionData, loading: introspectionLoading } = useQuery(
        getFilterInputsQuery
    );

    // Create a type map we can reference later to ensure we pass valid args
    // To the graphql query.
    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const filtersQuery = attributeCode
        ? {
              [attributeCode]: {
                  eq: props.option_id
              }
          }
        : {};

    const [runQuery, { called: searchCalled, loading: searchLoading, error, data }] = useLazyQuery(
        getShopByAttributeOptionDataQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: {
                optionId: props.option_id,
                pageSize,
                currentPage: 1,
                filters: filtersQuery
            }
        }
    );

    const aggregationsArray = useMemo(() => {
        return data?.products?.aggregations || [];
    }, [data]);

    const initialSearchFilter = useMemo(() => {
        if (props?.attributeSearch) {
            return `?${props?.attributeSearch.replace(/^.+\?/, '').replace(/&amp;/g, '&')}`;
        }

        return '';
    }, [props?.attributeSearch]);

    const { searchFilters, setSearchFilters } = useFilters({
        currentCategoryUrl,
        aggregationsArray,
        initialSearchFilter
    });

    const filterControl = useRef();

    const isBackgroundLoading = !!data && searchLoading;

    const getActiveFilters = useCallback(
        useIntial => {
            // Construct the filter arg object.
            const newFilters = attributeCode
                ? {
                      [attributeCode]: {
                          eq: props.option_id
                      }
                  }
                : {};

            if (!useIntial) {
                const sFilters = searchFilters || initialSearchFilter || '';

                const filtersSearch = getFiltersFromSearch(sFilters);
                const filters = getFiltersFromSearch(search);

                new Map([...filtersSearch, ...filters]).forEach((values, key) => {
                    newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
                });
            }
            return newFilters;
        },
        [attributeCode, filterTypeMap, initialSearchFilter, props.option_id, search, searchFilters]
    );

    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    useEffect(() => {
        // Wait until we have the type map to fetch product data.
        if (!filterTypeMap.size || !pageSize) {
            return;
        }
        const newFilters = getActiveFilters();

        runQuery({
            variables: {
                currentPage: Number(currentPage),
                filters: newFilters,
                inputText,
                pageSize: Number(pageSize),
                sort: { [sortAttribute]: sortDirection }
            }
        });
    }, [
        attributeCode,
        currentPage,
        currentSort,
        filterTypeMap,
        getActiveFilters,
        inputText,
        pageSize,
        props.option_id,
        runQuery,
        search,
        searchFilters,
        sortAttribute,
        sortDirection
    ]);

    useEffect(() => {
        // If we encounted filter configuration that leads to no filters being displayed
        // Reset back to initial state
        if (data?.products?.aggregations?.length === 0) {
            // Only reset if we have actually have any active filters besides the attribute page
            const activeFilters = Object.keys(getActiveFilters());
            if (activeFilters.length === 1 && activeFilters[0] === attributeCode) {
                return;
            }

            filterControl?.current?.handleReset();
        }
    }, [
        currentPage,
        data,
        getActiveFilters,
        inputText,
        pageSize,
        runQuery,
        sortAttribute,
        sortDirection,
        attributeCode
    ]);

    // Set the total number of pages whenever the data changes.
    useEffect(() => {
        const totalPagesFromData = data ? data.products.page_info.total_pages : null;

        setTotalPages(totalPagesFromData);

        return () => {
            setTotalPages(null);
        };
    }, [data, setTotalPages]);

    // Reset the current page back to one (1) when the search string, filters
    // Or sort criteria change.
    useEffect(() => {
        // We don't want to compare page value.
        const prevSearch = new URLSearchParams(previousSearch.current);
        const nextSearch = new URLSearchParams(search);
        prevSearch.delete('page');
        nextSearch.delete('page');

        if (
            prevSearch.toString() !== nextSearch.toString() ||
            previousSort.current.sortAttribute.toString() !== currentSort.sortAttribute.toString() ||
            previousSort.current.sortDirection.toString() !== currentSort.sortDirection.toString()
        ) {
            // The search term changed.
            setCurrentPage(1, true);
            // And update the ref.
            previousSearch.current = search;
            previousSort.current = currentSort;
        }
    }, [currentSort, search, setCurrentPage]);

    // Use static category filters when filtering by category otherwise use the
    // Default (and potentially changing!) aggregations from the product query.
    const filterResults = data ? data.products.aggregations : null;
    const filters = useMemo(() => {
        return filterResults
            ? filterResults.filter(({ amshopby_filter_data }) => isEnabledFilterByCategory(amshopby_filter_data, ''))
            : [];
    }, [filterResults]);

    // Avoid showing a "empty data" state between introspection and search.
    const loading =
        ((settingDataCalled || introspectionCalled) && !searchCalled) ||
        settingDataLoading ||
        searchLoading ||
        introspectionLoading;

    useScrollTopOnChange(currentPage);

    const availableSortMethods = data ? data.products.sort_fields.options : null;

    const categoryChildren = useMemo(() => {
        if (!data) {
            // The product isn't in the cache and we don't have a response from GraphQL yet.
            return false;
        }

        // Only return the product that we queried for.
        const bcProductType = data.products.aggregations.find(item => item.attribute_code === 'bc_product_type');
        const bcProductTypeCone = Object.assign({}, bcProductType);
        const { options } = bcProductTypeCone;
        if (!options) {
            return null;
        }
        const items = [...options];
        const content = items.sort((a, b) => b.count - a.count).slice(0, 8);

        if (!content) {
            return null;
        }

        bcProductTypeCone.options = content;

        return [bcProductTypeCone];
    }, [data]);

    const shopByAttributeOption = useMemo(() => {
        if (!routeData) {
            return null;
        }
        return {
            ...(settingData?.shopByAttributeOption || {}),
            ...(routeData || {}),
            ...(data?.shopByAttributeOption || {})
        };
    }, [data, routeData, settingData]);

    const metaTitle = shopByAttributeOption?.meta_title?.replace(/[\u200B-\u200D\uFEFF]/g, '') || '';
    const metaDescription = shopByAttributeOption?.meta_description?.replace(/[\u200B-\u200D\uFEFF]/g, '') || '';

    const optionData = {
        meta_title: metaTitle || '',
        meta_description: metaDescription || '',
        meta_keywords: shopByAttributeOption?.meta_keywords || '',
        title: shopByAttributeOption?.value || '',
        description: shopByAttributeOption?.description || '',
        banner_path: shopByAttributeOption?.image || '',
        cmsBlockTop: shopByAttributeOption?.top_cms_block_identifier || '',
        cmsBlockBottom: shopByAttributeOption?.bottom_cms_block_identifier || '',
        isNewArrivals: shopByAttributeOption?.is_new_arrivals || ''
    };

    const richData = shopByAttributeOption?.rich_data || {};
    const hreflangLinks = shopByAttributeOption?.hreflang_links || [];
    const canonicalUrl = shopByAttributeOption?.canonical_url || '';

    return {
        availableSortMethods,
        data,
        error,
        filters,
        pageControl,
        loading,
        pageSize,
        sortProps,
        categoryChildren,
        optionData,
        openDrawer,
        richData,
        filterControl,
        hreflangLinks,
        canonicalUrl,
        searchFilters: {
            currentCategoryUrl,
            searchFilters,
            setSearchFilters
        }
    };
};
