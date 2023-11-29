import { useQuery } from '@apollo/client';

import { GET_CUSTOMER_REVIEWS } from '@app/components/ProductReviews/productReviews.gql.js';
import { usePagination } from '@magento/peregrine/lib/hooks/usePagination';

export const useProductReviews = () => {
    const [paginationValues, paginationApi] = usePagination();

    const { currentPage } = paginationValues;
    const { setCurrentPage } = paginationApi;
    const { data: productReviewsData, loading: isLoadingReviews } = useQuery(GET_CUSTOMER_REVIEWS, {
        fetchPolicy: 'cache-and-network',
        variables: {
            currentPage: Number(currentPage),
            pageSize: 5
        }
    });

    const totalPagesFromData = productReviewsData ? productReviewsData.customer.reviews.page_info.total_pages : [];

    const pageControl = {
        currentPage,
        setPage: setCurrentPage,
        totalPages: totalPagesFromData
    };

    const productReviews = productReviewsData ? productReviewsData.customer.reviews.items : [];
    return { productReviews, isLoadingReviews, pageControl };
};
