import React from 'react';
import { connectHitInsights, Hits as HitsComponent } from 'react-instantsearch-dom';
import searchInsights from 'search-insights';

import GalleryItem from '@app/components/overrides/Gallery/item';
import { transformHitToProduct } from '@app/util/algolia';
import { useGallery } from '@magento/peregrine/lib/talons/Gallery/useGallery';

import classes from './hits.module.css';
import { useHits } from './useHits';

const Hit = connectHitInsights(searchInsights)(({ hit, insights }) => {
    const { storeConfig, handleProductClick } = useHits({ insights });

    return (
        <GalleryItem
            item={transformHitToProduct(hit)}
            storeConfig={storeConfig}
            hit={hit}
            onItemClick={handleProductClick}
        />
    );
});

const Hits = () => {
    const { storeConfig } = useGallery();

    return (
        <div className={classes.root}>
            <div className={classes.galleryRoot} aria-live="polite" aria-busy="false">
                <div className={classes.items}>
                    <HitsComponent hitComponent={Hit} storeConfig={storeConfig} />
                </div>
            </div>
        </div>
    );
};

export default Hits;
