import { useAmIlnContext } from '@amasty/iln/src/context';
import { useCallback, useState, useEffect, useMemo, useRef } from 'react';

import { useWindowSize } from '@magento/peregrine';

const alwaysVisibleModes = ['Slider', 'From-To Only', 'category_ids'];

export const isFilterBlockHidden = (filterState, filterBlockSettings, amshopby_general_keep_single_choice_visible) => {
    const { is_multiselect, display_mode_label } = filterBlockSettings || {};

    return (
        filterState &&
        filterState.size &&
        !is_multiselect &&
        !amshopby_general_keep_single_choice_visible &&
        !alwaysVisibleModes.includes(display_mode_label)
    );
};

export const useFilterBlock = props => {
    const { filterState, items, initialOpen, filterApi, group } = props;

    const hasSelected = useMemo(() => {
        return items.some(item => {
            return filterState && filterState.has(item);
        });
    }, [filterState, items]);

    const [isExpanded, setExpanded] = useState(hasSelected || initialOpen);

    useEffect(() => {
        setExpanded(hasSelected || initialOpen);
    }, [hasSelected, initialOpen]);

    const handleClick = useCallback(() => {
        setExpanded(value => !value);
    }, [setExpanded]);

    const { amshopby_general_keep_single_choice_visible } = useAmIlnContext() || {};

    const filterBlockSettings = useMemo(() => filterApi.getAmFilterData(group), [group, filterApi]);

    const { is_expanded } = filterBlockSettings || {};

    const windowSize = useWindowSize();
    const isMobile = windowSize.innerWidth <= 1024;

    const isExpandedByDevice = useMemo(() => {
        return !isMobile ? !!is_expanded : is_expanded && is_expanded !== 2; // 2 - expand only desktop
    }, [is_expanded, isMobile]);

    const prevExpanded = useRef(null);

    useEffect(() => {
        if (prevExpanded.current === null && isExpandedByDevice && !isExpanded) {
            prevExpanded.current = isExpanded;
            handleClick();
        }
    }, [isExpandedByDevice, prevExpanded, isExpanded, handleClick]);

    const isHidden = useMemo(
        () => isFilterBlockHidden(filterState, filterBlockSettings, amshopby_general_keep_single_choice_visible),
        [filterState, filterBlockSettings, amshopby_general_keep_single_choice_visible]
    );

    return {
        handleClick,
        isExpanded,
        filterBlockSettings,
        isHidden
    };
};
