import { arrayOf, shape, string } from 'prop-types';
import React from 'react';
import { useHistory } from 'react-router-dom';

import handleHtmlContentClick from '../../handleHtmlContentClick';

import defaultClasses from '@magento/pagebuilder/lib/ContentTypes/Html/html.module.css';
import { useStoreSwitcher } from '@magento/peregrine/lib/talons/Header/useStoreSwitcher';
import { useStyle } from '@magento/venia-ui/lib/classify';

const toHTML = str => ({ __html: str });

/**
 * Page Builder HTML component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Html
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that renders HTML with optional styling properties.
 */
const Html = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        html,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = []
    } = props;

    const dynamicStyles = {
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const history = useHistory();

    // Getting currentStoreCode
    const { currentStoreCode } = useStoreSwitcher();

    // Modifying params to handleHtmlContentClick
    const clickHandler = event => {
        handleHtmlContentClick(history, event, currentStoreCode);
    };

    return (
        <div
            style={dynamicStyles}
            className={[classes.root, ...cssClasses].join(' ')}
            dangerouslySetInnerHTML={toHTML(html)}
            onClick={clickHandler}
            onKeyDown={clickHandler}
            role="presentation"
        />
    );
};

/**
 * Props for {@link Html}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Html
 * @property {String} classes.root CSS classes for the root container element
 * @property {String} html HTML code to be rendered as part of component
 * @property {String} textAlign Alignment of the video within the parent container
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Html.propTypes = {
    classes: shape({
        root: string
    }),
    html: string,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    cssClasses: arrayOf(string)
};

export default Html;
