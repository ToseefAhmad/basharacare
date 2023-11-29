import React, { createContext, useContext } from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import { useAccordion } from './useAccordion';

const AccordionContext = createContext();
const { Provider } = AccordionContext;

const Accordion = props => {
    const { canOpenMultiple = true, children, noScrollIntoView } = props;

    // The talon is the source of truth for the context value.
    const accordionObject = useAccordion({ canOpenMultiple, children, noScrollIntoView });
    const classes = useStyle(props.classes);

    const domNodeRef = node => accordionObject.domNodeRef(node);

    return (
        <Provider value={accordionObject}>
            <div ref={domNodeRef} className={classes.root}>
                {children}
            </div>
        </Provider>
    );
};

export default Accordion;

export const useAccordionContext = () => useContext(AccordionContext);
