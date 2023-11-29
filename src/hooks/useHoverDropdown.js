import _ from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

import { useUserContext } from '@magento/peregrine/lib/context/user';

const DEFAULT_DEBOUNCE = 200;

/**
 * Provides dropdown logic with hover trigger
 */
export const useHoverDropdown = debounce => {
    const debounceAmount = typeof debounce !== 'undefined' ? debounce : DEFAULT_DEBOUNCE;
    const elementRef = useRef();
    const triggerRef = useRef();
    const [expanded, setExpanded] = useState(false);

    const [{ isSignedIn: isUserSignedIn }] = useUserContext();

    const dynamicClickEventName = !isUserSignedIn ? 'click' : 'mouseover';

    // Collapse on mouseover outside of the element and trigger.
    const maybeCollapse = useCallback(({ target }) => {
        const isOutsideElement = !elementRef.current || !elementRef.current.contains(target);
        const isOutsideTrigger = !triggerRef.current || !triggerRef.current.contains(target);

        if (isOutsideElement && isOutsideTrigger) {
            setExpanded(false);
        }
    }, []);
    const debouncedCollapse = debounceAmount > 0 ? _.debounce(maybeCollapse, debounceAmount) : maybeCollapse;

    useEffect(() => {
        if (!globalThis.document) return;
        if (expanded) {
            document.addEventListener(dynamicClickEventName, debouncedCollapse);
        } else {
            document.removeEventListener(dynamicClickEventName, debouncedCollapse);
        }

        // Return a callback, which is called on unmount
        return () => {
            document.removeEventListener(dynamicClickEventName, debouncedCollapse);
        };
    }, [debouncedCollapse, dynamicClickEventName, expanded]);

    return {
        elementRef,
        triggerRef,
        expanded,
        setExpanded
    };
};
