import { shape, string } from 'prop-types';
import React from 'react';

import { useToasts } from '../../../hooks/useToasts';

import { default as mergeClasses } from '@magento/peregrine/lib/util/shallowMerge';

import Toast from './toast';
import defaultClasses from './toastContainer.module.css';

const ToastContainer = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const [{ toasts }] = useToasts();

    // Given a map of toasts each with a property "timestamp", sort and display
    // Based on the timestamp.
    const sortByTimestamp = ([, toastA], [, toastB]) => toastA.timestamp - toastB.timestamp;

    const toastElements = Array.from(toasts)
        .sort(sortByTimestamp)
        .map(([id, toast]) => {
            const key = toast.isDuplicate ? Math.random() : id;

            return <Toast key={key} {...toast} />;
        });

    return (
        <div id="toast-root" className={classes.root}>
            {toastElements}
        </div>
    );
};

ToastContainer.propTypes = {
    classes: shape({
        root: string
    })
};

export default ToastContainer;
