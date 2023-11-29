import { useAmIlnContext } from '@amasty/iln/src/context';
import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory, useLocation } from 'react-router-dom';

import { getMergedStateFromSearch, getTitle, getSearchFiltersState } from '@app/util/filter';
import { useAppContext } from '@magento/peregrine/lib/context/app';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/FilterModal/filterModal.gql';
import {
    DELIMITER,
    getFiltersFromSearch,
    getSearchFromState,
    sortFiltersArray,
    stripHtml
} from '@magento/peregrine/lib/talons/FilterModal/helpers';
import { useFilterState } from '@magento/peregrine/lib/talons/FilterModal/useFilterState';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const DRAWER_NAME = 'filter';

const CATEGORY_ID_GROUP = 'category_id';

export const useFilterSidebar = props => {
    const { filters } = props;
    const { searchFilters, setSearchFilters, currentCategoryUrl } = props.searchFilters;

    const filtersChecked = useMemo(() => (filters ? filters : []), [filters]);

    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getFilterInputsQuery } = operations;

    const [isApplying, setIsApplying] = useState(false);
    const [{ drawer }, { toggleDrawer, closeDrawer }] = useAppContext();
    const [filterState, filterApi] = useFilterState();

    const prevDrawer = useRef(null);
    const isOpen = drawer === DRAWER_NAME;

    const history = useHistory();
    const { pathname, search } = useLocation();

    const { data: introspectionData } = useQuery(getFilterInputsQuery);

    const attributeCodes = useMemo(() => filtersChecked?.map(({ attribute_code }) => attribute_code) || [], [
        filtersChecked
    ]);

    // Create a set of disabled filtersChecked.
    const DISABLED_FILTERS = useMemo(() => {
        const disabled = new Set();
        // Disable category filtering when not on a search page.
        if (pathname !== '/search.html') {
            disabled.add('category_id');
        }

        return disabled;
    }, [pathname]);

    // Get "allowed" filtersChecked by intersection of filter attribute codes and
    // Schema input field types. This restricts the displayed filtersChecked to those
    // That the api will understand.
    const possibleFilters = useMemo(() => {
        const nextFilters = new Set();
        const inputFields = introspectionData ? introspectionData.__type.inputFields : [];
        // Perform mapping and filtering in the same cycle
        for (const { name } of inputFields) {
            const isValid = attributeCodes.includes(name);
            const isEnabled = !DISABLED_FILTERS.has(name);

            if (isValid && isEnabled) {
                nextFilters.add(name);
            }
        }

        return nextFilters;
    }, [DISABLED_FILTERS, attributeCodes, introspectionData]);

    // Iterate over filtersChecked once to set up all the collections we need
    const [filterNames, filterKeys, filterItems] = useMemo(() => {
        const names = new Map();
        const keys = new Set();
        const itemsByGroup = new Map();

        const sortedFilters = sortFiltersArray([...filtersChecked]);

        for (const filter of sortedFilters) {
            const { options, label: name, attribute_code: group } = filter;

            // If this aggregation is not a possible filter, just back out.
            if (possibleFilters.has(group)) {
                const items = [];

                // Add filter name
                names.set(group, name);

                // Add filter key permutations
                keys.add(`${group}[filter]`);

                // Add items
                for (const { label, value, count } of options) {
                    items.push({ title: stripHtml(label), value, count });
                }
                itemsByGroup.set(group, items);
            }
        }

        return [names, keys, itemsByGroup];
    }, [filtersChecked, possibleFilters]);

    const {
        currencyCode,
        amasty_shopby_seo_url_special_char: specialChar,
        amasty_shopby_seo_url_option_separator: optionSeparator
    } = useAmIlnContext() || {};
    // On apply, write filter state to location
    useEffect(() => {
        if (isApplying) {
            const nextSearch = getSearchFromState(searchFilters, filterKeys, filterState);
            const { path: newPathname, search: newSearch } = getSearchFiltersState(
                filterState,
                pathname,
                currentCategoryUrl,
                optionSeparator,
                specialChar,
                filterKeys
            );

            setSearchFilters(nextSearch);
            // Write filter state to history
            history.push({ pathname: newPathname, search: newSearch });

            // Mark the operation as complete
            setIsApplying(false);
        }
    }, [
        filterKeys,
        filterState,
        history,
        isApplying,
        pathname,
        searchFilters,
        setSearchFilters,
        specialChar,
        optionSeparator,
        currentCategoryUrl
    ]);

    const handleOpen = useCallback(() => {
        toggleDrawer(DRAWER_NAME);
    }, [toggleDrawer]);

    const handleClose = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    const handleApply = useCallback(() => {
        setIsApplying(true);
        handleClose();
    }, [handleClose]);

    const handleReset = useCallback(() => {
        setSearchFilters('');
        filterApi.clear();
        setIsApplying(true);
    }, [filterApi, setSearchFilters]);

    const handleKeyDownActions = useCallback(
        event => {
            // Do not handle keyboard actions when the modal is closed
            if (!isOpen) {
                return;
            }

            switch (event.keyCode) {
                // When "Esc" key fired -> close the modal
                case 27:
                    handleClose();
                    break;
            }
        },
        [isOpen, handleClose]
    );

    useEffect(() => {
        const justOpened = prevDrawer.current === null && drawer === DRAWER_NAME;
        const justClosed = prevDrawer.current === DRAWER_NAME && drawer === null;

        // On drawer toggle, read filter state from location
        if (justOpened || justClosed) {
            const nextState = getMergedStateFromSearch(search, searchFilters, filterKeys, filterItems);

            filterApi.setItems(nextState);
        }

        // On drawer close, update the modal visibility state
        if (justClosed) {
            handleClose();
        }

        prevDrawer.current = drawer;
    }, [drawer, filterApi, filterItems, filterKeys, searchFilters, handleClose, search]);

    useEffect(() => {
        const nextState = getMergedStateFromSearch(search, searchFilters, filterKeys, filterItems);

        filterApi.setItems(nextState);
    }, [filterApi, filterItems, filterKeys, searchFilters, search]);

    const { formatMessage, locale } = useIntl();

    const amShopByFilterData = useMemo(() => {
        const inputFilters = getFiltersFromSearch(searchFilters);
        const dataByGroup = new Map();

        for (const filter of filters) {
            const { attribute_code: group, label: name, amshopby_filter_data, options: defaultOptions } = filter;

            dataByGroup.set(group, amshopby_filter_data);

            const { is_seo_significant } = amshopby_filter_data || {};

            if (filterItems.has(group) || group === CATEGORY_ID_GROUP) {
                filterNames.set(group, name);
                filterKeys.add(`${group}[filter]`);

                const groupItems = new Set(inputFilters.get(group));
                const options = [...defaultOptions];

                if (groupItems.size) {
                    for (const item of groupItems) {
                        const [title, value] = item.split(DELIMITER);
                        const isIncluded = options.find(option => option.value === value);

                        if (!isIncluded) {
                            options.push({
                                count: 1,
                                label: title,
                                value,
                                custom: true
                            });
                        }
                    }
                }

                const items = options.map(({ label, value, title, ...rest }) => {
                    const formattedTitle = getTitle({
                        title,
                        label,
                        value,
                        displayMode: amshopby_filter_data.display_mode_label,
                        currencyCode,
                        locale
                    });

                    return {
                        ...rest,
                        title: typeof formattedTitle === 'object' ? formatMessage(...formattedTitle) : formattedTitle,
                        value,
                        is_seo_significant: is_seo_significant
                    };
                });

                filterItems.set(group, items);
            }
        }

        return dataByGroup;
    }, [searchFilters, filters, filterItems, filterNames, filterKeys, currencyCode, locale, formatMessage]);

    const getAmFilterData = useCallback(group => amShopByFilterData.get(group), [amShopByFilterData]);

    return {
        filterItems,
        filterKeys,
        filterNames,
        filterState,
        handleApply,
        handleClose,
        handleKeyDownActions,
        handleOpen,
        handleReset,
        isApplying,
        isOpen,
        filterApi: {
            filterApi,
            getAmFilterData
        }
    };
};
