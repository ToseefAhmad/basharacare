import React from 'react';
import { Index } from 'react-instantsearch-dom';

import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

const BlogSearchIndex = ({ children }) => {
    const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;

    return <Index indexName={`${ALGOLIA_SEARCH_INDEX_PREFIX}_${storeCode}_blogs`}>{children}</Index>;
};

export default BlogSearchIndex;
