import { useAmIlnContext } from '@amasty/iln/src/context';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { getSearchFromState } from '@magento/peregrine/lib/talons/FilterModal/helpers';

export const isEnabledFilterByCategory = (filterData, categoryId) => {
    const { visible_in_categories, categories_filter } = filterData;

    if (visible_in_categories === 'only_in_selected_categories') {
        return categories_filter && categories_filter.split(',').includes(categoryId.toString());
    } else if (visible_in_categories === 'hide_in_selected_categories') {
        return !categories_filter || !categories_filter.split(',').includes(categoryId.toString());
    }

    return visible_in_categories === null || visible_in_categories === 'visible_everywhere';
};

export const useFilters = ({ currentCategoryUrl, aggregationsArray, initialSearchFilter }) => {
    const [searchFilters, setSearchFilters] = useState(initialSearchFilter);
    const [currentUrl, setCurrentUrl] = useState('');
    const { amasty_shopby_seo_url_option_separator: optionSeparator } = useAmIlnContext() || {};
    const { pathname } = useLocation();

    const [filterKeys, filterItems] = useMemo(() => {
        const arrayKeys = pathname
            .replace(/^\/|\/$/g, '')
            .replace(currentCategoryUrl, '')
            .replace(/^\/|\/$/g, '')
            .split(optionSeparator)
            .filter(el => el);

        const filterKeys = new Set();
        const filterItems = new Map();
        arrayKeys.forEach(key => {
            const filterData = aggregationsArray.filter(attr => attr.amshopby_filter_data.is_seo_significant);

            filterData.forEach(({ options, attribute_code }) => {
                filterKeys.add(`${attribute_code}[filter]`);
                options.forEach(option => {
                    if (key === option.url_alias) {
                        const filter = new Set();
                        filter.add({
                            count: option.count,
                            image: option.image,
                            title: option.label,
                            value: option.value
                        });
                        filterItems.set(attribute_code, filter);
                    }
                });
            });
        });
        return [filterKeys, filterItems];
    }, [aggregationsArray, currentCategoryUrl, optionSeparator, pathname]);

    useEffect(() => {
        const currentFilterUrl = currentCategoryUrl + initialSearchFilter;

        if (currentCategoryUrl && currentUrl !== currentFilterUrl) {
            setSearchFilters(initialSearchFilter || '');
            setCurrentUrl(currentFilterUrl);
        }
    }, [currentCategoryUrl, currentUrl, initialSearchFilter]);

    useEffect(() => {
        if (filterKeys.size && filterItems.size) {
            if (searchFilters !== '?' && searchFilters !== '') {
                setSearchFilters(getSearchFromState(searchFilters, filterKeys, filterItems));
            }
            if (searchFilters === null) {
                setSearchFilters(getSearchFromState(searchFilters, filterKeys, filterItems));
            }
        }
    }, [filterItems, filterKeys, searchFilters, setSearchFilters]);

    return {
        searchFilters,
        setSearchFilters
    };
};
