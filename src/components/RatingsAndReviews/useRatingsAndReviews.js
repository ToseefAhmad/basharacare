import { useQuery } from '@apollo/client';
import { useEffect, useState, useCallback } from 'react';

import { GET_REVIEWS_AND_RATINGS } from './ratingsAndReviews.gql';

export const useRatingsAndReviews = props => {
    const { sku, pageSize } = props;

    const [reviews, setReviews] = useState([]);
    const [paginatorArray, setPaginatorArray] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(null);

    const { data: productReviewsAndRatings, loading: isLoadingReviews, refetch } = useQuery(GET_REVIEWS_AND_RATINGS, {
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
        variables: {
            sku,
            currentPage,
            pageSize
        },
        skip: !sku
    });

    const getNumberObject = useCallback(
        pageNumber => {
            if (!pageNumber) return { value: currentPage, label: '...' };

            if (pageNumber >= 10) return { value: pageNumber, label: pageNumber };

            return { value: pageNumber, label: `0${pageNumber}` };
        },
        [currentPage]
    );

    const constructPaginationArray = useCallback(
        props => {
            return props.map(prop => {
                return getNumberObject(prop);
            });
        },
        [getNumberObject]
    );

    const getPaginatorArray = useCallback(() => {
        if (!totalPages) return null;

        if (totalPages <= 9) {
            return new Array(totalPages).fill(null).map((_, index) => {
                return { value: index + 1, label: `0${index + 1}` };
            });
        } else {
            if (totalPages - currentPage >= 4 && currentPage >= 4) {
                return constructPaginationArray([
                    1,
                    null,
                    currentPage - 2,
                    currentPage - 1,
                    currentPage,
                    currentPage + 1,
                    currentPage + 2,
                    null,
                    totalPages
                ]);
            } else if (currentPage < 4) {
                return constructPaginationArray([1, 2, 3, 4, 5, null, totalPages]);
            } else if (totalPages - currentPage < 4) {
                return constructPaginationArray([
                    1,
                    null,
                    totalPages - 4,
                    totalPages - 3,
                    totalPages - 2,
                    totalPages - 1,
                    totalPages
                ]);
            }
        }
    }, [totalPages, currentPage, constructPaginationArray]);

    const changeCurrentPage = value => {
        refetch({
            fetchPolicy: 'cache-and-network',
            nextFetchPolicy: 'cache-first',
            variables: {
                sku,
                currentPage: value,
                pageSize
            }
        }).then(() => {
            setCurrentPage(value);
        });
    };

    useEffect(() => {
        if (!productReviewsAndRatings) return;

        setReviews(productReviewsAndRatings.products.items[0].reviews.items);

        setCurrentPage(productReviewsAndRatings.products.items[0].reviews.page_info.current_page);

        setTotalPages(productReviewsAndRatings.products.items[0].reviews.page_info.total_pages);

        setPaginatorArray(getPaginatorArray());
    }, [getPaginatorArray, productReviewsAndRatings]);

    return {
        reviews,
        isLoadingReviews,
        currentPage,
        totalPages,
        changeCurrentPage,
        paginatorArray
    };
};
