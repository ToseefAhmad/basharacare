import { node, shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './field.module.css';

const Field = props => {
    const { children, id, label } = props;
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            {label && (
                <label className={classes.label} htmlFor={id}>
                    {label}
                </label>
            )}
            {children}
        </div>
    );
};

Field.propTypes = {
    children: node,
    classes: shape({
        root: string
    }),
    id: string,
    label: node
};

export default Field;
