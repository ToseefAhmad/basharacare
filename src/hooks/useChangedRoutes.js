import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

export const useChangedRoutes = ({ key, callback }) => {
    const { pathname } = useLocation();

    useEffect(() => {
        const status = storage.getItem(key);

        if (!pathname.includes(key) && status) {
            callback();
            storage.removeItem(key);
        }
    }, [callback, key, pathname]);
};
