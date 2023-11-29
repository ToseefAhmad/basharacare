import React from 'react';
import { connectHits } from 'react-instantsearch-dom';
import { FormattedMessage } from 'react-intl';

import Post from '@app/overrides/@amasty/components/List/post';
import { transformHitToBlog } from '@app/util/algolia';

import classes from './blogHits.module.css';

const BlogHits = ({ hits }) => {
    if (!hits) {
        return null;
    }
    return (
        <>
            <div className={classes.posts}>
                {hits.map(hit => (
                    <Post post={transformHitToBlog(hit)} key={hit.objectID} classes={{ root: classes.post }} />
                ))}
            </div>
            {!hits.length && (
                <p className={classes.noHits}>
                    <FormattedMessage id="blogHits.noResults" defaultMessage="Could not find any results" />
                </p>
            )}
        </>
    );
};

export default connectHits(BlogHits);
