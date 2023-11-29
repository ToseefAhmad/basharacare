import { Radio as InformedRadio } from 'informed';
import { node, shape, string } from 'prop-types';
import React from 'react';
import { Square } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './radio.module.css';

// eslint-disable-next-line no-warning-comments
/* TODO: change lint config to use `label-has-associated-control` */
/* eslint-disable jsx-a11y/label-has-for */

const RadioOption = props => {
    const { classes: propClasses, id, label, value, children, rootRef, ...rest } = props;
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <label ref={rootRef} className={classes.root} htmlFor={id}>
            <InformedRadio {...rest} className={classes.input} id={id} value={value} />
            <span className={classes.icon}>
                <Square />
            </span>
            <span className={classes.label}>{label || (value != null ? value : '')}</span>
            {children}
        </label>
    );
};

export default RadioOption;

RadioOption.propTypes = {
    classes: shape({
        icon: string,
        input: string,
        label: string,
        root: string
    }),
    id: string.isRequired,
    label: node.isRequired,
    value: node.isRequired
};
