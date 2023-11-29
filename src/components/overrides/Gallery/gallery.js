import { string, shape, array, func } from 'prop-types';
import React, { useMemo } from 'react';

import AmProductLabelProvider from '@app/components/ProductLabels/context';
import { useGallery } from '@magento/peregrine/lib/talons/Gallery/useGallery';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './gallery.module.css';
import GalleryItem from './item';
import GalleryItemShimmer from './item.shimmer';

/**
 * Renders a Gallery of items. If items is an array of nulls Gallery will render
 * a placeholder item for each.
 *
 * @params {Array} props.items an array of items to render
 */
const Gallery = ({ items, onItemClick, ...props }) => {
    const classes = useStyle(defaultClasses, props.classes);
    const talonProps = useGallery();
    const { storeConfig } = talonProps;

    const galleryItems = useMemo(
        () =>
            items.map((item, index) => {
                if (item === null) {
                    return <GalleryItemShimmer key={index} />;
                }
                return (
                    <GalleryItem
                        {...props}
                        key={item.id}
                        item={item}
                        storeConfig={storeConfig}
                        onItemClick={onItemClick}
                    />
                );
            }),
        [items, storeConfig, props, onItemClick]
    );

    return (
        <AmProductLabelProvider products={items} mode="CATEGORY">
            <div className={classes.root} aria-live="polite" aria-busy="false">
                <div className={classes.items}>{galleryItems}</div>
            </div>
        </AmProductLabelProvider>
    );
};

Gallery.propTypes = {
    classes: shape({
        filters: string,
        items: string,
        pagination: string,
        root: string
    }),
    onItemClick: func,
    items: array.isRequired
};

export default Gallery;
