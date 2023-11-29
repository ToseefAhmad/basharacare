import { useMutation } from '@apollo/client';
import { useCallback } from 'react';
import { useIntl } from 'react-intl';

import { useToasts } from '@magento/peregrine';

import { SET_STATUS_RESPONSE } from './surveyItem.gql.js';

export const useSurveyItem = ({ entity_id, updateHandle }) => {
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const [setStatus] = useMutation(SET_STATUS_RESPONSE, {
        fetchPolicy: 'no-cache'
    });

    const handleStatusUpdate = useCallback(async () => {
        await setStatus({
            variables: {
                id: entity_id
            }
        });
        updateHandle();
        addToast({
            type: 'success',
            message: formatMessage({
                id: 'SurveyItem.Success',
                defaultMessage: 'Status successfully changed'
            })
        });
    }, [addToast, entity_id, formatMessage, setStatus, updateHandle]);

    const getDate = timestamp => {
        const separatedTimeAndDate = timestamp.split(' ');
        const dateArray = separatedTimeAndDate[0].split('-');

        return dateArray.join('/');
    };

    return {
        handleStatusUpdate,
        getDate
    };
};
