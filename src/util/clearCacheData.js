import { CACHE_PERSIST_PREFIX } from '@magento/peregrine/lib/Apollo/constants';

export const clearCacheData = currentStoreCode => {
    // Clear other stores
    for (const store of AVAILABLE_STORE_VIEWS) {
        if (store.code !== currentStoreCode) {
            const storeCacheKey = `${CACHE_PERSIST_PREFIX}-${store.code}`;
            const existingStorePersistor = globalThis.localStorage.getItem(storeCacheKey);
            if (existingStorePersistor && Object.keys(existingStorePersistor).length > 0) {
                globalThis.localStorage.removeItem(storeCacheKey);
            }
        }
    }
};
