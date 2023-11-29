import classNames from 'classnames';
import { oneOf, shape, string, bool } from 'prop-types';
import React, { useRef } from 'react';
import { useButton } from 'react-aria';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './button.module.css';

const getRootClassName = (priority, negative) => `root_${priority}Priority${negative ? 'Negative' : ''}`;

/**
 * A component for buttons.
 *
 * @typedef Button
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a single button.
 */
const Button = props => {
    const { children, classes: propClasses, priority, negative, disabled, onPress, fullWidth, ...restProps } = props;

    const buttonRef = useRef();

    const { buttonProps } = useButton(
        {
            isDisabled: disabled,
            onPress,
            ...restProps
        },
        buttonRef
    );

    const classes = useStyle(defaultClasses, propClasses);
    const rootClassName = classes[getRootClassName(priority, negative)];

    return (
        <button
            ref={buttonRef}
            className={classNames(rootClassName, {
                [classes.fullWidth]: fullWidth
            })}
            {...buttonProps}
            {...restProps}
        >
            <span className={classes.content}>{children}</span>
        </button>
    );
};

/**
 * Props for {@link Button}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * Button component.
 * @property {string} classes.content classes for the button content
 * @property {string} classes.root classes for root container
 * @property {string} classes.root_highPriority classes for Button if
 * high priority.
 * @property {string} classes.root_lowPriority classes for Button if
 * low priority.
 * @property {string} classes.root_normalPriority classes for Button if
 * normal priority.
 *  * @property {string} classes.root_bannerPriority classes for Button if
 * banner priority.
 * @property {string} priority the priority/importance of the Button
 * @property {string} type the type of the Button
 * @property {bool} negative whether the button should be displayed in red for a negative action
 * @property {bool} disabled is the button disabled
 */
Button.propTypes = {
    classes: shape({
        content: string,
        root: string,
        root_highPriority: string,
        root_lowPriority: string,
        root_normalPriority: string,
        root_bannerPriority: string,
        root_routinePriority: string
    }),
    priority: oneOf(['high', 'low', 'normal', 'banner', 'cart', 'reviewForm', 'link', 'routine']).isRequired,
    type: oneOf(['button', 'reset', 'submit']).isRequired,
    negative: bool,
    disabled: bool,
    fullWidth: bool
};

Button.defaultProps = {
    priority: 'normal',
    type: 'button',
    negative: false,
    disabled: false,
    fullWidth: false
};

export default Button;
