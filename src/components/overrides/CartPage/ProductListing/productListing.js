import React, { Fragment, Suspense } from 'react';

import Product from '@app/components/overrides/CartPage/ProductListing/product';
import { useAppContext } from '@app/context/App';
import { useProductListing } from '@magento/peregrine/lib/talons/CartPage/ProductListing/useProductListing';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './productListing.module.css';

const EditModal = React.lazy(() => import('@magento/venia-ui/lib/components/CartPage/ProductListing/EditModal'));
/**
 * A child component of the CartPage component.
 * This component renders the product listing on the cart page.
 *
 * @param {Object} props
 * @param {Function} props.setIsCartUpdating Function for setting the updating state of the cart.
 * @param {Object} props.classes CSS className overrides.
 * See [productListing.module.css]{@link https://github.com/magento/pwa-studio/blob/develop/packages/venia-ui/lib/components/CartPage/ProductListing/productListing.module.css}
 * for a list of classes you can override.
 *
 * @returns {React.Element}
 *
 * @example <caption>Importing into your project</caption>
 * import ProductListing from "@magento/venia-ui/lib/components/CartPage/ProductListing";
 */

const ProductListing = ({ onAddToWishlistSuccess, setIsCartUpdating, fetchCartDetails, shimmerCount, ...props }) => {
    const talonProps = useProductListing();
    const [{ isSigningIn }] = useAppContext();

    const { activeEditItem, isLoading, items, setActiveEditItem, wishlistConfig } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const shimmer = [...Array(shimmerCount)].map((item, idx) => (
        <Shimmer key={idx} classes={{ root_rectangle: classes.shimmerRoot }} width="100%" />
    ));

    if (isLoading || isSigningIn) return <div>{shimmer}</div>;

    if (items.length) {
        const productComponents = items.map(product => (
            <Product
                classes={props.grandParentClasses}
                item={product}
                key={product.uid}
                setActiveEditItem={setActiveEditItem}
                setIsCartUpdating={setIsCartUpdating}
                onAddToWishlistSuccess={onAddToWishlistSuccess}
                fetchCartDetails={fetchCartDetails}
                wishlistConfig={wishlistConfig}
            />
        ));

        return (
            <Fragment>
                <div className={classes.itemHeader} />
                <div className={classes.root} data-cy="ProductListing-root">
                    {productComponents}
                </div>

                <Suspense fallback={null}>
                    <EditModal
                        item={activeEditItem}
                        setIsCartUpdating={setIsCartUpdating}
                        setActiveEditItem={setActiveEditItem}
                    />
                </Suspense>
            </Fragment>
        );
    }

    return null;
};

export default ProductListing;
