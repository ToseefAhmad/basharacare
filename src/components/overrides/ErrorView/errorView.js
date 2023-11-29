import { number, shape, string } from 'prop-types';
import React from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import { Meta } from '@magento/venia-ui/lib/components/Head';

import defaultClasses from './errorView.module.css';

const ErrorView = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const errorCode = props.code || 404;

    return (
        <div className={classes.root} data-cy="ErrorView-root">
            <Meta name="prerender-status-code" content={errorCode} />
            <CmsBlock
                identifiers="not-found"
                classes={{
                    block: null,
                    content: null,
                    root: classes.notFound
                }}
            />
        </div>
    );
};

ErrorView.propTypes = {
    block: string,
    content: string,
    root: string,
    classes: shape({
        notFound: string
    }),
    code: number
};

export default ErrorView;
