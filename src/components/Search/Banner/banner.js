import { string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import classes from './banner.module.css';
import { Breadcrumb } from './breadcrumb';

const Banner = ({ query }) => {
    return (
        <div className={classes.root}>
            <div className={classes.container}>
                <Breadcrumb searchValue={query} />
                <h1 className={classes.title}>
                    <FormattedMessage
                        id="searchPage.title"
                        defaultMessage="Search results for: ''{value}''"
                        values={{ value: query }}
                    />
                </h1>
            </div>
        </div>
    );
};

Banner.propTypes = {
    query: string
};

export default Banner;
