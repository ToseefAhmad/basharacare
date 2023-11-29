import { Children, useEffect, useState, useRef, useCallback } from 'react';

export const useAccordion = ({ canOpenMultiple, children, noScrollIntoView }) => {
    const [openSectionIds, setOpenSectionIds] = useState(new Set([]));

    const openSectionIdsRef = useRef(openSectionIds);
    const initialOpenSectionIdsRef = useRef();
    const userOpenedSectionIdsRef = useRef();

    const sectionIds = new Set();
    const accordionObject = {
        sectionIds,
        openSectionIds
    };

    let domNode;
    let onDomNodeReady;

    const isConditional = () => {
        return domNode != null && domNode.classList.contains('conditional-accordion');
    };

    const isAccordionEnabled = () => {
        return isConditional() && getComputedStyle(domNode).getPropertyValue('--conditional-accordion-enable') == 1;
    };

    /* eslint-disable react-hooks/exhaustive-deps */
    accordionObject.handleSectionToggle = useCallback(sectionId => {
        if (isConditional() && !isAccordionEnabled()) return;

        setOpenSectionIds(prevOpenSectionIds => {
            const nextOpenSectionIds = new Set(prevOpenSectionIds);

            if (!prevOpenSectionIds.has(sectionId)) {
                // The user wants to open this section.
                // If we don't allow multiple sections to be open, close the others first.
                if (!canOpenMultiple) {
                    nextOpenSectionIds.clear();
                }

                nextOpenSectionIds.add(sectionId);
            } else {
                // The user wants to close this section.
                nextOpenSectionIds.delete(sectionId);
            }

            openSectionIdsRef.current = nextOpenSectionIds;
            return nextOpenSectionIds;
        });
    }, []);

    // If any of the sections have their isOpen prop set to true initially, honor that.
    // We never want to re-run this effect, even if deps change.
    /* eslint-disable react-hooks/exhaustive-deps */
    useEffect(() => {
        const isOpenPropTruthy = child => child.props.isOpen;

        // Set first item of pagebuilder accordion to be open
        const initialOpenSectionIds = new Set(['pbId-0']);
        let firstOpenSectionId;

        Children.toArray(children).forEach(child => {
            if (isOpenPropTruthy(child)) {
                const { id: childId } = child.props;

                initialOpenSectionIds.add(childId);

                if (!firstOpenSectionId) {
                    firstOpenSectionId = childId;
                }
            }
        });

        // If there are multiple sections with isOpen props initially set to true
        // And we only allow one, just use the first one.
        if (!canOpenMultiple && initialOpenSectionIds.size > 1) {
            initialOpenSectionIds.clear();
            initialOpenSectionIds.add(firstOpenSectionId);
        }

        onDomNodeReady = () => {
            if (isConditional()) {
                prevIsAccordionEnabled = isAccordionEnabled();

                window.addEventListener('resize', onResize);
            }
        };

        userOpenedSectionIdsRef.current = initialOpenSectionIdsRef.current = initialOpenSectionIds;

        const nextOpenSectionIds = isConditional()
            ? isAccordionEnabled()
                ? initialOpenSectionIds
                : accordionObject.sectionIds
            : initialOpenSectionIds;

        openSectionIdsRef.current = nextOpenSectionIds;
        setOpenSectionIds(nextOpenSectionIds);

        let prevIsAccordionEnabled;

        const onResize = () => {
            const accordionEnabled = isAccordionEnabled();
            const userOpenedSectionIds = userOpenedSectionIdsRef.current;

            if (prevIsAccordionEnabled && !accordionEnabled) {
                // Show all sections
                userOpenedSectionIdsRef.current = openSectionIdsRef.current;
                openSectionIdsRef.current = sectionIds;
                setOpenSectionIds(sectionIds);
            } else if (!prevIsAccordionEnabled && accordionEnabled) {
                // Show selected sections
                openSectionIdsRef.current = userOpenedSectionIds;
                setOpenSectionIds(userOpenedSectionIds);
            }

            prevIsAccordionEnabled = accordionEnabled;
        };

        return () => window.removeEventListener('resize', onResize);
    }, []);

    accordionObject.domNodeRef = useCallback(node => {
        if (node != null) {
            domNode = node.parentNode;

            if (onDomNodeReady != null) onDomNodeReady();

            !noScrollIntoView && scrollIntoViewWithOffset(node, 50);
        } else {
            domNode = null;
        }
    }, []);

    return accordionObject;
};

const scrollIntoViewWithOffset = (element, offset) => {
    window.scrollTo({
        top: element.getBoundingClientRect().top - document.body.getBoundingClientRect().top - offset
    });
};
