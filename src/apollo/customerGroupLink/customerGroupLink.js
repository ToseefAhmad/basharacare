import guestCacheQueries from './guestCacheQueries.json';

/**
 * Provide customer group header.
 * Used in Varnish cache key hashing to differentiate customer group specific content
 *
 * @param operationName
 * @param headers
 * @returns {{headers}}
 */
export const handleCustomerGroupLink = (operationName, headers) => {
    const extendedHeaders = {};

    if (guestCacheQueries.includes(operationName)) {
        extendedHeaders['customer-group'] = 'guest';
    }

    return {
        headers: {
            ...headers,
            ...extendedHeaders
        }
    };
};
