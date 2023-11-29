import { array } from 'prop-types';
import React, { Fragment, Children } from 'react';

import { Accordion as AccordionHtml, Section } from '@app/components/overrides/Accordion';

/**
 * @param children
 * @returns {JSX.Element|null}
 * @constructor
 */
const Accordion = ({ children }) => {
    if (!children) {
        return null;
    }

    const content = Children.map(children, (child, index) => {
        return (
            <Section key={'pb-title-' + index} title={child.props.data.header} id={'pbId-' + index}>
                {child}
            </Section>
        );
    });

    return (
        <Fragment>
            <AccordionHtml noScrollIntoView canOpenMultiple={false}>
                {content}
            </AccordionHtml>
        </Fragment>
    );
};

/**
 * @type {{children: Requireable<any[]>}}
 */
Accordion.propTypes = {
    children: array
};
export default Accordion;
