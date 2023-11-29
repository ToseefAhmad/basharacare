import { useState, useEffect } from 'react';

import { useOnScroll } from '@app/hooks/useOnScroll';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';

// Checks if element is currently in the viewport
export const useElementVisibility = ({ element }) => {
    const OFFSET = 100;
    const { innerHeight, innerWidth } = useWindowSize();

    const [isVisible, setIsVisible] = useState(false);

    const checkVisibility = () => {
        if (element) {
            const domRect = element.getBoundingClientRect();

            setIsVisible(
                (domRect.top >= OFFSET || domRect.bottom >= OFFSET) &&
                    domRect.left >= 0 &&
                    (domRect.bottom <= innerHeight || domRect.top <= innerHeight) &&
                    domRect.right <= innerWidth
            );
        }
    };

    useEffect(checkVisibility, [innerHeight, element, innerWidth]);

    useOnScroll(globalThis.document, checkVisibility);

    return {
        isVisible
    };
};
