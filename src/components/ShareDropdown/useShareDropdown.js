import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo } from 'react';
import { useCookies } from 'react-cookie';

import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

import defaultOperations from './shareDropdown.gql';

export const useShareDropdown = () => {
    const operations = mergeOperations(defaultOperations);
    const [cookies] = useCookies();

    const appType = useMemo(() => {
        return cookies?.['application-type'] || 'web';
    }, [cookies]);
    const { getAddThisPubId } = operations;

    const { data: storeConfigData } = useQuery(getAddThisPubId, {
        fetchPolicy: 'cache-only'
    });

    const addThisPubId = storeConfigData?.storeConfig?.addthis_pubid;

    const handleClick = useCallback(() => {
        switch (appType) {
            case 'ios':
                window?.webkit?.messageHandlers?.iOSListener?.postMessage({ name: 'share' });
                break;
            case 'android':
                android?.share(document.title, window.location.href);
                break;
        }
    }, [appType]);

    useEffect(() => {
        if (addThisPubId && (!appType || appType === 'web')) {
            const script = document.createElement('script');
            script.src = `https://s7.addthis.com/js/300/addthis_widget.js#${addThisPubId}`;
            script.async = true;
            document.body.appendChild(script);
            return () => {
                document.body.removeChild(script);
            };
        }
    }, [addThisPubId, appType]);

    return {
        addThisPubId,
        appType,
        handleClick
    };
};
