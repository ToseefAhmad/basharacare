import { string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import classes from './banner.module.css';

export const Breadcrumb = ({ searchValue }) => {
    return (
        <div className={classes.breadcrumbRoot}>
            <Link className={classes.link} to="/">
                <FormattedMessage id="global.home" defaultMessage="Home" />
            </Link>
            <span className={classes.divider}>/</span>
            <span className={classes.currentBreadcrumb}>
                <FormattedMessage
                    id="searchBreadcrumb.label"
                    defaultMessage="Search results for: ''{searchValue}''"
                    values={{
                        searchValue
                    }}
                />
            </span>
        </div>
    );
};

Breadcrumb.propTypes = {
    searchValue: string
};
