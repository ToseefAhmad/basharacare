import { string } from 'prop-types';
import React, { Fragment, useEffect } from 'react';

import JsonLd from '@app/components/JsonLd';
import OpenGraph from '@app/components/OpenGraph';
import ProductFullDetail from '@app/components/overrides/ProductFullDetail';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { Meta, Link, Title } from '@magento/venia-ui/lib/components/Head';
import mapProduct from '@magento/venia-ui/lib/util/mapProduct';

import ProductShimmer from './product.shimmer';
import { useProduct } from './useProduct';

/*
 * As of this writing, there is no single Product query type in the M2.3 schema.
 * The recommended solution is to use filter criteria on a Products query.
 * However, the `id` argument is not supported. See
 * https://github.com/magento/graphql-ce/issues/86
 * Replace with a single product query when possible.
 */

const Product = props => {
    const { __typename: productType } = props;
    const talonProps = useProduct({
        mapProduct
    });

    useEffect(() => {
        document.body.classList.add('product-page');
        return () => globalThis.document.body.classList.remove('product-page');
    }, []);

    const { error, loading, product, productTabs, viewedProducts } = talonProps;

    const isSampleProduct = product?.is_sample === '1' || false;

    useEffect(() => {
        const storage = new BrowserPersistence();
        const recentlyViewedProductsString = storage.getItem('RECENTLY_VIEWED_PRODUCTS');

        if (!product) return;

        if (!recentlyViewedProductsString) {
            storage.setItem('RECENTLY_VIEWED_PRODUCTS', product.sku);
            return;
        }

        if (recentlyViewedProductsString.includes(product.sku)) return;

        storage.setItem('RECENTLY_VIEWED_PRODUCTS', product.sku + ', ' + recentlyViewedProductsString);
    }, [product]);

    if (loading && !product) return <ProductShimmer productType={productType} />;

    if ((!loading && !product) || error || isSampleProduct) {
        return <ErrorView />;
    }

    if (!product && !error && !loading) {
        return <ProductShimmer productType={productType} />;
    }

    const keywordsElement = product.meta_keyword ? <Meta name="keywords" content={product.meta_keyword} /> : null;

    const hreflangLinksElement = product.hreflang_links
        ? product.hreflang_links.map(({ href, hreflang }) => {
              return <Link key={hreflang} rel="alternate" href={href} hreflang={hreflang} />;
          })
        : null;

    const JsonLdElements = Object.keys(product.rich_data).map(key => {
        if (product.rich_data[key] && key !== '__typename') {
            return <JsonLd key={key} data={product.rich_data[key]} />;
        }
    });

    return (
        <Fragment>
            {JsonLdElements}
            <OpenGraph metaArray={product.open_graph} />
            <Title>{product.meta_title}</Title>
            <Link rel="canonical" href={product.canonical_url} />
            <Meta name="title" content={product.meta_title} />
            {hreflangLinksElement}
            {keywordsElement}
            <Meta name="description" content={product.meta_description} />
            <ProductFullDetail product={product} productTabs={productTabs} viewedProducts={viewedProducts} />
        </Fragment>
    );
};

Product.propTypes = {
    __typename: string.isRequired
};

export default Product;
