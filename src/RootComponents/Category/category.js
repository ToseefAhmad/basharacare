import { string } from 'prop-types';
import React, { Fragment } from 'react';

import JsonLd from '@app/components/JsonLd';
import OpenGraph from '@app/components/OpenGraph';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';
import { Meta, Link, Title } from '@magento/venia-ui/lib/components/Head';

import classes from './category.module.css';
import CategoryContent from './categoryContent';
import { useCategory } from './useCategory';

const Category = ({ uid, attributeSearch }) => {
    const {
        error,
        metaTitle,
        metaDescription,
        canonicalUrl,
        loading,
        category,
        products,
        aggregations,
        pageControl,
        sortProps,
        pageSize,
        hreflangLinks,
        openGraphArray,
        richDataArray,
        richDataProducts,
        searchFilters
    } = useCategory({
        id: uid,
        attributeSearch
    });

    if (!products && error && pageControl.currentPage === 1) {
        if (process.env.NODE_ENV !== 'production') {
            console.error(error);
        }

        return <ErrorView code="500" />;
    }

    const hreflangLinksElement = hreflangLinks.map(({ href, hreflang }) => {
        return <Link key={hreflang} rel="alternate" href={href} hreflang={hreflang} />;
    });

    const JsonLdElements = Object.keys(richDataArray).map(key => {
        if (richDataArray[key] && key !== '__typename') {
            return <JsonLd key={key} data={richDataArray[key]} />;
        }
    });

    return (
        <Fragment>
            {JsonLdElements}
            {!!richDataProducts && <JsonLd data={richDataProducts} />}
            <OpenGraph metaArray={openGraphArray} />
            {hreflangLinksElement}
            <Link rel="canonical" href={canonicalUrl} />
            <Title>{metaTitle}</Title>
            <Meta name="title" content={metaTitle} />
            <Meta name="description" content={metaDescription} />
            <CategoryContent
                classes={classes}
                categoryId={uid}
                category={category}
                products={products}
                aggregations={aggregations}
                isLoading={loading}
                pageControl={pageControl}
                sortProps={sortProps}
                pageSize={pageSize}
                metaTitle={metaTitle}
                searchFilters={searchFilters}
            />
        </Fragment>
    );
};

Category.propTypes = {
    uid: string,
    attributeSearch: string
};

Category.defaultProps = {
    uid: 'Mg==',
    attributeSearch: ''
};

export default Category;
