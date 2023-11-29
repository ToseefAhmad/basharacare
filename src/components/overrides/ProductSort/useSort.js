import { useState } from 'react';
import { useIntl } from 'react-intl';

const fallbackDefaultSort = {
    sortText: 'New Arrival',
    sortId: 'sortItem.created_at',
    sortAttribute: 'created_at',
    sortDirection: 'DESC'
};

/**
 *
 * @param props
 * @returns {[{sortDirection: string, sortAttribute: string, sortText: string}, React.Dispatch<React.SetStateAction<{sortDirection: string, sortAttribute: string, sortText: string}>>]}
 */
export const useSort = (props = {}) => {
    const { formatMessage } = useIntl();

    const defaultSortData = props.defaultSort ? props.defaultSort : fallbackDefaultSort;
    return useState(() =>
        Object.assign(
            {},
            {
                ...defaultSortData,
                sortText: formatMessage({
                    defaultMessage: defaultSortData.sortText,
                    id: defaultSortData.sortId
                })
            },
            props
        )
    );
};
