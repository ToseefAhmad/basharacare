import { useLazyQuery, useQuery } from '@apollo/client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { useSort } from '@app/components/overrides/ProductSort/useSort';
import { useAwaitQuery } from '@app/hooks/useAwaitQuery';
import { useFilters } from '@app/hooks/useFilters';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';
import { useScrollTopOnChange } from '@magento/peregrine/lib/hooks/useScrollTopOnChange';
import { getFiltersFromSearch, getFilterInput } from '@magento/peregrine/lib/talons/FilterModal/helpers';

import DEFAULT_OPERATIONS from './category.gql';

/**
 *  * A [React Hook]{@link https://reactjs.org/docs/hooks-intro.html} that
 *  * controls the logic for the Category Root Component.
 *
 * @param id
 * @param attributeSearch
 * @returns {{canonicalUrl: (*|string), sortProps: [{sortDirection: string, sortAttribute: string, sortText: string},React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}>>], openGraphArray: *, pageSize: (any), error: ApolloError, loading: boolean, richDataProducts: undefined, metaDescription: (string|string), richDataArray: *, hreflangLinks: (*|*[]), metaTitle: (string|string), searchFilters: {searchFilters: unknown, currentCategoryUrl: string, setSearchFilters: (value: unknown) => void}, category: unknown, pageControl: {totalPages, currentPage, setPage}}}
 */
export const useCategory = ({ id, attributeSearch }) => {
    const {
        getCategoryPageSizeQuery,
        getCategoryQuery,
        getCategoryProductsQuery,
        getFilterInputsQuery,
        getProductsRichDataQuery
    } = DEFAULT_OPERATIONS;

    const { data: categoryData, error: categoryError } = useQuery(getCategoryQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            id: id
        }
    });

    const category = useMemo(() => {
        return (!categoryError && categoryData && categoryData.categories?.items[0]) || undefined;
    }, [categoryData, categoryError]);

    const { data: pageSizeData } = useQuery(getCategoryPageSizeQuery, {
        fetchPolicy: 'cache-only'
    });
    const pageSize = pageSizeData && pageSizeData.storeConfig.grid_per_page;
    const [paginationValues, paginationApi] = usePagination();
    const { currentPage, totalPages } = paginationValues;
    const { setCurrentPage, setTotalPages } = paginationApi;
    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages
    };

    const sortProps = useSort();
    const [currentSort] = sortProps;
    // Keep track of the sort criteria so we can tell when they change.
    const previousSort = useRef(currentSort);

    const { search } = useLocation();
    // Keep track of the search terms so we can tell when they change.
    const previousSearch = useRef(search);

    const [
        ,
        {
            actions: { setPageLoading }
        }
    ] = useAppContext();

    const [
        fetchCategoryProducts,
        {
            data: categoryProductsData,
            called: categoryProductsCalled,
            loading: categoryProductsLoading,
            error: categoryProductsError
        }
    ] = useLazyQuery(getCategoryProductsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });
    const { aggregations, products, totalPagesFromData } = useMemo(() => {
        return categoryProductsData
            ? {
                  aggregations: categoryProductsData.products.aggregations,
                  products: categoryProductsData.products.items,
                  totalPagesFromData: categoryProductsData.products.page_info.total_pages
              }
            : {
                  aggregations: [],
                  products: [],
                  totalPagesFromData: 1
              };
    }, [categoryProductsData]);

    const isBackgroundLoading = !!products && categoryProductsLoading;
    // Update the page indicator if the GraphQL query is in flight.
    useEffect(() => {
        setPageLoading(isBackgroundLoading);
    }, [isBackgroundLoading, setPageLoading]);

    const urlKey = category?.url_key || '';
    const initialSearchFilter = useMemo(() => {
        if (attributeSearch) {
            return `?${attributeSearch.replace(/^.+\?/, '').replace(/&amp;/g, '&')}`;
        }

        return '';
    }, [attributeSearch]);

    const { searchFilters, setSearchFilters } = useFilters({
        currentCategoryUrl: urlKey,
        aggregationsArray: aggregations,
        initialSearchFilter
    });

    // Get "allowed" filters by intersection of schema and aggregations
    const { called: introspectionCalled, data: introspectionData, loading: introspectionLoading } = useQuery(
        getFilterInputsQuery,
        {
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first'
        }
    );

    // Create a type map we can reference later to ensure we pass valid args
    // To the graphql query.
    // For example: { category_id: 'FilterEqualTypeInput', price: 'FilterRangeTypeInput' }
    const filterTypeMap = useMemo(() => {
        const typeMap = new Map();
        if (introspectionData) {
            introspectionData.__type.inputFields.forEach(({ name, type }) => {
                typeMap.set(name, type.name);
            });
        }
        return typeMap;
    }, [introspectionData]);

    // Run the category query immediately and whenever its variable values change.
    useEffect(() => {
        // Wait until we have the type map to fetch product data.
        if (!filterTypeMap.size || !pageSize) {
            return;
        }
        const filtersSearch = getFiltersFromSearch(searchFilters);
        const filters = getFiltersFromSearch(search);

        // Construct the filter arg object.
        const newFilters = {};
        new Map([...filtersSearch, ...filters]).forEach((values, key) => {
            newFilters[key] = getFilterInput(values, filterTypeMap.get(key));
        });

        // Use the category uid for the current category page regardless of the
        // Applied filters. Follow-up in PWA-404.
        newFilters['category_uid'] = newFilters['category_uid'] || { eq: id };

        fetchCategoryProducts({
            variables: {
                pageSize: Number(pageSize),
                currentPage: Number(currentPage),
                filters: newFilters,
                sort: { [currentSort.sortAttribute]: currentSort.sortDirection }
            }
        });
    }, [
        currentPage,
        currentSort.sortAttribute,
        currentSort.sortDirection,
        fetchCategoryProducts,
        filterTypeMap,
        id,
        pageSize,
        search,
        searchFilters
    ]);

    useEffect(() => {
        setTotalPages(totalPagesFromData);
        return () => {
            setTotalPages(null);
        };
    }, [setTotalPages, totalPagesFromData]);

    // If we get an error after loading we should try to reset to page 1.
    // If we continue to have errors after that, render an error message.
    useEffect(() => {
        if (categoryProductsError && !categoryProductsLoading && !categoryProductsData && currentPage !== 1) {
            setCurrentPage(1);
        }
    }, [categoryProductsData, categoryProductsError, categoryProductsLoading, currentPage, setCurrentPage]);

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
    }, [currentSort, previousSearch, search, setCurrentPage]);

    // When only categoryLoading is involved, noProductsFound component flashes for a moment
    const loading =
        (introspectionCalled && !categoryProductsCalled) ||
        (categoryProductsLoading && !categoryProductsData) ||
        introspectionLoading;

    useScrollTopOnChange(currentPage);

    const metaTitle = category ? category.meta_title.replace(/[\u200B-\u200D\uFEFF]/g, '') : '';
    const title = category ? category.title : '';
    const metaDescription = category ? category.meta_description.replace(/[\u200B-\u200D\uFEFF]/g, '') : '';
    const canonicalUrl = category ? category.canonical_url : '';
    const hreflangLinks = category ? category.hreflang_links : [];
    const openGraphArray = category ? category.open_graph : {};
    const richDataArray = category ? category.rich_data : {};

    const queryProductsRichData = useAwaitQuery(getProductsRichDataQuery);
    const [richDataProducts, setRichDataProducts] = useState();

    const skus = useMemo(() => {
        const results = [];
        if (products) {
            products.forEach(item => {
                results.push(item.sku);
            });
        }
        return results;
    }, [products]);

    // Fetch products rich data if we have products in category
    // Cache-first as we do not need to refetch this normally.
    // This is meant for prerender, and it reopens pages with no cache
    useEffect(() => {
        const fetchData = async () => {
            if (!richDataProducts && skus.length > 0) {
                const queryResponse = await queryProductsRichData({
                    variables: {
                        skus: skus
                    },
                    fetchPolicy: 'cache-first'
                });
                const richData = queryResponse.data.productsRichData.map(item => JSON.parse(item.rich_data));
                setRichDataProducts(JSON.stringify(richData));
            }
        };
        fetchData();
    }, [queryProductsRichData, richDataProducts, skus]);

    return {
        error: categoryProductsError,
        category,
        products,
        aggregations,
        loading,
        pageControl,
        sortProps,
        pageSize,
        title,
        metaTitle,
        hreflangLinks,
        metaDescription,
        canonicalUrl,
        openGraphArray,
        richDataArray,
        richDataProducts,
        searchFilters: {
            currentCategoryUrl: urlKey,
            searchFilters,
            setSearchFilters
        }
    };
};
