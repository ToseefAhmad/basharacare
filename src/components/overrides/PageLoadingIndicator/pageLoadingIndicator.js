import { shape, string, bool } from 'prop-types';
import React from 'react';

import usePageLoadingIndicator from '@magento/peregrine/lib/talons/PageLoadingIndicator/usePageLoadingIndicator';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './pageLoadingIndicator.module.css';

const PageLoadingIndicator = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { absolute } = props;
    const { isPageLoading, loadingState } = usePageLoadingIndicator();

    if (!isPageLoading && !absolute) {
        return null;
    }

    return (
        <div className={absolute ? classes.root_absolute : classes.root}>
            <div className={classes[`indicator_${loadingState}`]} />
        </div>
    );
};

PageLoadingIndicator.defaultProps = {
    classes: {},
    absolute: false
};

PageLoadingIndicator.propTypes = {
    classes: shape({
        root: string
    }),
    absolute: bool
};

export default PageLoadingIndicator;
