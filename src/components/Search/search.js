import classNames from 'classnames';
import { object } from 'prop-types';
import React, { useEffect, useMemo, useRef } from 'react';
import { Configure, connectSearchBox, connectStateResults } from 'react-instantsearch-dom';
import { FormattedMessage, useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

import AmProductLabelProvider from '@app/components/ProductLabels/context';
import { useAppContext } from '@app/context/App';
import { useElementVisibility } from '@app/hooks/useElementVisibility';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import Banner from './Banner';
import CurrentRefinement from './CurrentRefinement';
import Filters from './Filters';
import FilterModalOpenButton from './Filters/FilterModal/filterModalOpenButton';
import Hits from './Hits';
import Pagination from './Pagination';
import classes from './search.module.css';
import Sort from './Sort';
import { useSearch } from './useSearch';

export const SearchValue = connectSearchBox(({ currentRefinement }) => {
    return currentRefinement;
});

const Search = connectStateResults(({ searching, searchResults }) => {
    const [{ isSearchOpen }, { setIsSearchOpen }] = useAppContext();
    const { listen } = useHistory();
    const { filterAttributes, sortingItems, numberOfProducts } = useSearch();
    const { formatMessage } = useIntl();

    useEffect(() => {
        listen(() => {
            setIsSearchOpen(false);
        });
    }, [listen, setIsSearchOpen]);

    const headerButtonsRef = useRef();
    const searchRef = useRef();
    const { isVisible: isHeaderButtonsVisible } = useElementVisibility({ element: headerButtonsRef.current });
    const { isVisible: isSearchContentVisible } = useElementVisibility({ element: searchRef.current });

    const productIDs = useMemo(() => {
        if (searchResults && searchResults.hits) {
            return searchResults.hits.map(item => {
                return {
                    id: item.objectID
                };
            });
        }
        return [];
    }, [searchResults]);

    if (!searchResults) {
        return null;
    }

    const title = formatMessage(
        {
            id: 'search.pageTitle',
            defaultMessage: "Search results for: ''{currentRefinement}''"
        },
        {
            currentRefinement: searchResults.query
        }
    );

    return (
        <article className={classes.root} ref={searchRef}>
            {isSearchOpen && <StoreTitle>{title}</StoreTitle>}
            <Configure hitsPerPage={numberOfProducts} clickAnalytics />
            <>
                <div className={classes.banner}>
                    <Banner query={searchResults.query} />
                </div>
                {searchResults.nbHits > 0 ? (
                    <>
                        <div className={classes.heading} ref={headerButtonsRef}>
                            <div className={classes.currentRefinements}>
                                <CurrentRefinement />
                            </div>
                            <div className={classes.sort}>
                                <FilterModalOpenButton />
                                {sortingItems && (
                                    <Sort items={sortingItems} defaultRefinement={sortingItems[0]?.value} />
                                )}
                            </div>
                        </div>
                        <div className={classes.container}>
                            <div className={classes.sidebar}>
                                <Filters
                                    attributes={filterAttributes}
                                    disjunctiveFacets={searchResults.disjunctiveFacets}
                                />
                            </div>
                            {searching && (
                                <LoadingIndicator>
                                    <FormattedMessage id="searchPage.searching" defaultMessage="Searching..." />
                                </LoadingIndicator>
                            )}
                            <div
                                className={classNames(classes.content, {
                                    [classes.hidden]: searching
                                })}
                            >
                                <AmProductLabelProvider products={productIDs} mode="CATEGORY">
                                    <Hits />
                                </AmProductLabelProvider>
                                <Pagination />
                            </div>
                        </div>
                    </>
                ) : (
                    <div className={classes.noResults}>
                        <p>
                            <FormattedMessage
                                id="searchPage.noResults"
                                defaultMessage="Could not find any results for ''{value}''"
                                values={{ value: searchResults.query }}
                            />
                        </p>
                    </div>
                )}
            </>
            <div
                className={classNames(classes.filterButtonFixedContainer, {
                    [classes.filterButtonFixedHidden]: isHeaderButtonsVisible || !isSearchContentVisible
                })}
            >
                <FilterModalOpenButton
                    classes={{
                        filterButton: classes.filterButtonFixed
                    }}
                />
            </div>
        </article>
    );
});

Search.propTypes = {
    searchResults: object
};

export default connectStateResults(Search);
