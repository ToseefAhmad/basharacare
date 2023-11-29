import { useLayoutEffect } from 'react';

const SCROLL_EVENT = 'scroll';

/**
 * Expose onScroll event
 */
export const useOnScroll = (target, listener) => {
    useLayoutEffect(() => {
        target.addEventListener(SCROLL_EVENT, listener);

        // Return a callback, which is called on unmount
        return () => {
            target.removeEventListener(SCROLL_EVENT, listener);
        };
    }, [target, listener]);
};
