import algoliasearch from 'algoliasearch';
import React, { useMemo } from 'react';
import { InstantSearch, QueryRuleCustomData } from 'react-instantsearch-dom';
import searchInsights from 'search-insights';

import { BrowserPersistence } from '@magento/peregrine/lib/util';

import debounce from './debounce';

const storage = new BrowserPersistence();

const algoliaSearchClient = algoliasearch(ALGOLIA_SEARCH_APP_ID, ALGOLIA_SEARCH_API_KEY);
searchInsights('init', {
    appId: ALGOLIA_SEARCH_APP_ID,
    apiKey: ALGOLIA_SEARCH_API_KEY,
    useCookie: true
});

// Client has redirect rules setup on his Algolia dashboard that we need to check
// MB-21457
const handleAlgoliaPotentialRedirectRules = items => {
    const match = items && items.find(data => Boolean(data.redirect));
    if (match && match.redirect) {
        window.location.href = match.redirect;
    }
    return [];
};

const InstantSearchWrapper = ({ children }) => {
    const storeCode = useMemo(() => storage.getItem('store_view_code') || STORE_VIEW_CODE, []);
    const algoliaClient = useMemo(() => {
        return {
            ...algoliaSearchClient,

            // Debounce search requests slightly to reduce cost and API usage
            search: debounce(requests => {
                // If request is empty don't bother calling Algolia. To reduce cost and API usage
                // Check MB-20560
                if (requests.every(({ params }) => !params.query)) {
                    return Promise.resolve({
                        results: requests.map(() => ({
                            hits: [],
                            nbHits: 0,
                            nbPages: 0,
                            page: 0,
                            processingTimeMS: 0,
                            hitsPerPage: 0,
                            exhaustiveNbHits: false,
                            query: '',
                            params: ''
                        }))
                    });
                }

                return algoliaSearchClient.search(requests);
            }, 100)
        };
    }, []);

    const queryRuleCustomData = useMemo(() => {
        return (
            <QueryRuleCustomData transformItems={handleAlgoliaPotentialRedirectRules}>{() => null}</QueryRuleCustomData>
        );
    }, []);

    return (
        <InstantSearch searchClient={algoliaClient} indexName={`${ALGOLIA_SEARCH_INDEX_PREFIX}_${storeCode}_products`}>
            <>
                {queryRuleCustomData}
                {children}
            </>
        </InstantSearch>
    );
};

export default InstantSearchWrapper;
