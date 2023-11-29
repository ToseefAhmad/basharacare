import { useQuery } from '@apollo/client';
import { useEffect, useState, useCallback, useRef } from 'react';
import searchInsights from 'search-insights';

import { useTracking } from '@app/hooks/useTracking';
import { createHashSha256 } from '@app/util/crypto';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import galleryOperations from '@magento/peregrine/lib/talons/Gallery/gallery.gql';

export const useHits = ({ insights }) => {
    const { trackProductClick } = useTracking();
    const [{ currentUser }] = useUserContext();
    const [userToken, setUserToken] = useState(null);
    const generatingHash = useRef(null);

    // Get store config from useGallery.
    const { data: storeConfigData } = useQuery(galleryOperations.getStoreConfigQuery, {
        fetchPolicy: 'cache-only'
    });

    const setUserTokenFromCurrentUser = useCallback(async () => {
        if (currentUser?.email && generatingHash.current !== currentUser.email) {
            generatingHash.current = currentUser.email;
            const hash = await createHashSha256(currentUser.email);

            setUserToken(hash);
            generatingHash.current = null;
        }
    }, [currentUser, setUserToken]);

    useEffect(() => {
        if (currentUser?.email) {
            setUserTokenFromCurrentUser().catch(e => console.error(e));
            return;
        }

        if (searchInsights) {
            searchInsights('getUserToken', null, (err, algoliaUserToken) => {
                if (err) {
                    console.error(err);
                    return;
                }

                setUserToken(algoliaUserToken);
            });
        }
    }, [currentUser, setUserToken, setUserTokenFromCurrentUser]);

    const handleProductClick = useCallback(
        product => {
            insights('clickedObjectIDsAfterSearch', {
                eventName: 'Product Clicked',
                userToken
            });
            trackProductClick({
                list: 'Search',
                product: {
                    sku: product.sku,
                    name: product.name,
                    price: product.price_range.maximum_price.final_price.value,
                    currency: product.price_range.maximum_price.final_price.currency,
                    category: product.category_name,
                    brand: product.brand_name
                }
            });
        },
        [insights, trackProductClick, userToken]
    );

    return {
        userToken,
        storeConfig: storeConfigData?.storeConfig,
        handleProductClick
    };
};
