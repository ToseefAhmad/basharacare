import React, { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { SkinCare } from '@app/components/Icons';
import Button from '@app/components/overrides/Button';
import Pagination from '@app/components/overrides/Pagination/pagination';
import AmProductLabelProvider from '@app/components/ProductLabels/context';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './productsRoutine.module.css';
import RoutineItem from './routineItem';

const ProductsRoutine = ({ isAddingItemsToCart, handleAddAllProduct, items, pageControl, classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);

    const galleryItems = useMemo(
        () =>
            items.map(item => {
                return <RoutineItem key={item.product.id} item={item} />;
            }),
        [items]
    );

    const galleryItemsElement = (
        <AmProductLabelProvider products={items} mode="CATEGORY">
            <div className={classes.gallery} aria-live="polite" aria-busy="false">
                <div className={classes.items}>{galleryItems}</div>
            </div>
        </AmProductLabelProvider>
    );

    const actionButtonsElement = items?.length ? (
        <div className={classes.actionButtons}>
            <Button priority="routine" disabled={isAddingItemsToCart} onClick={handleAddAllProduct}>
                <FormattedMessage id="ProductsRoutine.addItemsToCart" defaultMessage="Add all items" />
            </Button>
        </div>
    ) : null;

    return items?.length ? (
        <div className={classes.root}>
            <h2 className={classes.title}>
                <FormattedMessage id="ProductsRoutine.galleryTitle" defaultMessage="Now you can start" />
                <SkinCare />
            </h2>
            <h3 className={classes.subTitle}>
                <FormattedMessage id="ProductsRoutine.gallerySubTitle" defaultMessage="your skincare journey!" />
            </h3>
            {galleryItemsElement}
            <Pagination pageControl={pageControl} />
            {actionButtonsElement}
        </div>
    ) : null;
};

export default ProductsRoutine;
