import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo } from 'react';

import { isEnabledFilterByCategory } from '@app/hooks/useFilters';
import { useTracking } from '@app/hooks/useTracking';
import { useDerivedClasses } from '@app/RootComponents/Category/useDerivedClasses';

import DEFAULT_OPERATIONS from './categoryContent.qql';

export const useCategoryContent = ({
    classes,
    categoryId,
    category,
    products,
    aggregations,
    isLoading,
    pageSize,
    searchFilters
}) => {
    const { getCategoryAvailableSortMethodsQuery } = DEFAULT_OPERATIONS;
    const placeholderItems = Array.from({ length: pageSize }).fill(null);
    const items = products && !isLoading ? products : placeholderItems;
    const categoryName = category ? category.name : null;
    const categoryDescription = category ? category.description : null;

    const { data: sortData } = useQuery(getCategoryAvailableSortMethodsQuery, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            categoryIdFilter: {
                in: categoryId
            }
        }
    });

    const availableSortMethods = sortData ? sortData.products.sort_fields.options : null;

    const filters = useMemo(() => {
        return aggregations
            ? aggregations.filter(({ amshopby_filter_data }) =>
                  isEnabledFilterByCategory(amshopby_filter_data, categoryId)
              )
            : [];
    }, [categoryId, aggregations]);

    const { derivedClasses } = useDerivedClasses({
        classes,
        urlKey: searchFilters.currentCategoryUrl
    });

    const { getProductCategories, trackProductsListView, trackProductClick } = useTracking();

    const handleProductClick = useCallback(
        product => {
            trackProductClick({
                list: `Category Page - ${categoryName}`,
                product: {
                    sku: product.sku,
                    name: product.name,
                    price: product.price_range.maximum_price.final_price.value,
                    currency: product.price_range.maximum_price.final_price.currency,
                    category: getProductCategories(product.categories),
                    brand: product.brand_name
                }
            });
        },
        [categoryName, getProductCategories, trackProductClick]
    );

    const handleProductsListView = useCallback(
        products => {
            if (products.length) {
                trackProductsListView({
                    list: `Category Page - ${categoryName}`,
                    products: products.map((product, index) => ({
                        sku: product.sku,
                        name: product.name,
                        price: product.price_range.maximum_price.final_price.value,
                        currency: product.price_range.maximum_price.final_price.currency,
                        category: product.categories ? getProductCategories(product.categories) : '',
                        brand: product.brand_name,
                        position: index + 1
                    }))
                });
            }
        },
        [categoryName, getProductCategories, trackProductsListView]
    );

    useEffect(() => {
        handleProductsListView(products);
    }, [products, handleProductsListView]);

    return {
        availableSortMethods,
        categoryName,
        categoryDescription,
        derivedClasses,
        filters,
        items,
        handleProductClick
    };
};
