import React from 'react';
import { connectStateResults } from 'react-instantsearch-dom';
import { FormattedMessage } from 'react-intl';

const BlogSearchTitle = ({ searchResults }) => {
    return (
        <FormattedMessage
            id="blogSearchTitle.title"
            defaultMessage="Search results for: ''{currentRefinement}''"
            values={{
                currentRefinement: searchResults?.query
            }}
        />
    );
};

export default connectStateResults(BlogSearchTitle);
