export const clearRewardDataFromCache = async client => {
    // Cached data
    client.cache.evict({ id: 'reward' });
    // Cached ROOT_QUERY
    client.cache.evict({ fieldName: 'reward' });

    client.cache.gc();

    if (client.persistor) {
        await client.persistor.persist();
    }
};
