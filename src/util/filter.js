import filterTypeConfig from '@amasty/iln/src/components/FilterList/filterTypeConfig';

import { getSearchFromState, getStateFromSearch, stripHtml } from '@magento/peregrine/lib/talons/FilterModal/helpers';

export const getTitle = ({ title, label, value, displayMode, currencyCode, locale }) => {
    const config = filterTypeConfig[displayMode];

    if (!title && config && config.optionTitle) {
        const { optionTitle } = config;

        return typeof optionTitle === 'function' ? optionTitle(value, { currencyCode, locale }) : optionTitle;
    }

    return stripHtml(label) || title;
};

export const getSearchFiltersState = (
    filterState,
    pathname,
    currentCategoryUrl,
    optionSeparator,
    specialChar,
    filterKeys
) => {
    let pathTmp = '';
    let searchTmp = '';

    filterState.forEach((item, group) => {
        if (item.values().next().value.is_seo_significant) {
            const optionKey = item
                .values()
                .next()
                .value.url_alias?.replace(/\W+(?!$)/g, specialChar)
                .replace(/\W$/, '')
                .toLowerCase();
            pathTmp += pathTmp ? optionSeparator + optionKey : '/' + optionKey;
        } else {
            searchTmp = getSearchFromState(searchTmp, filterKeys, new Map().set(group, item));
        }
    });

    return {
        path: '/' + currentCategoryUrl + pathTmp,
        search: searchTmp
    };
};

export const getMergedStateFromSearch = (search, searchFilters, filterKeys, filterItems) => {
    const nextFilterState = getStateFromSearch(searchFilters, filterKeys, filterItems);
    const nextState = getStateFromSearch(search, filterKeys, filterItems);
    return new Map([...nextState, ...nextFilterState]);
};
