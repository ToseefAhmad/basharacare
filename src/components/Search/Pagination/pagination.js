import { func, number } from 'prop-types';
import React, { useCallback } from 'react';
import { connectPagination } from 'react-instantsearch-dom';

import DefaultPagination from '@app/components/overrides/Pagination/pagination';

const Pagination = ({ currentRefinement, nbPages, refine }) => {
    const setPage = useCallback(
        page => {
            refine(page);
            globalThis.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        },
        [refine]
    );

    if (!nbPages) {
        return null;
    }

    return <DefaultPagination pageControl={{ currentPage: currentRefinement, setPage, totalPages: nbPages }} />;
};

Pagination.propTypes = {
    currentRefinement: number,
    nbPages: number,
    refine: func
};

export default connectPagination(Pagination);
