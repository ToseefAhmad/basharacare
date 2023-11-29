import React, { Fragment, useEffect, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Star } from '@app/components/Icons';
import JsonLd from '@app/components/JsonLd';
import ShopByAttributeItems from '@app/components/ShopByAttributeItems';
import { Link, Title } from '@magento/venia-ui/lib/components/Head';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import classes from './shopByAttribute.module.css';
import { useShopByAttribute } from './useShopByAttribute';

const ShopByAttribute = ({ url_page }) => {
    const { content, hreflangLinks, canonicalUrl, richData, loading } = useShopByAttribute({ url_page });

    const allButton = useRef();

    const [attributeFilter, setAttributeFilters] = useState([]);

    useEffect(() => {
        if (allButton.current) {
            allButton.current.focus();
        }
    }, []);

    useEffect(() => {
        if (content) {
            setAttributeFilters(Object.keys(content));
        }
    }, [content]);

    const allKeys = content ? Object.keys(content) : [];

    useEffect(() => {
        document.body.classList.add('shopByAttribute-page');
        return () => globalThis.document.body.classList.remove('shopByAttribute-page');
    }, []);

    const formattedIdentifier = url_page && url_page.charAt(0).toUpperCase() + url_page.slice(1).replace(/-/g, ' ');

    const itemList = allKeys
        .sort((a, b) => a.localeCompare(b))
        .map(item => (
            <button className={classes.attributeFilterButton} onClick={() => setAttributeFilters(item)} key={item}>
                {item}
            </button>
        ));

    const hreflangLinksElement = hreflangLinks.map(({ href, hreflang }) => {
        return <Link key={hreflang} rel="alternate" href={href} hreflang={hreflang} />;
    });

    const JsonLdElements = Object.keys(richData).map(key => {
        if (richData[key] && key !== '__typename') {
            return <JsonLd key={key} data={richData[key]} />;
        }
    });

    if (loading)
        return (
            <div className={classes.loadingContainer}>
                <LoadingIndicator>
                    <FormattedMessage
                        id="brandsPage.loadingText"
                        defaultMessage="Fetching {formattedIdentifier}"
                        values={{ formattedIdentifier }}
                    />
                </LoadingIndicator>
            </div>
        );

    return (
        <Fragment>
            <Title>{formattedIdentifier}</Title>
            {JsonLdElements}
            {hreflangLinksElement}
            <Link rel="canonical" href={canonicalUrl} />
            <div className={classes.attributeHeaderContainer}>
                <h1 className={classes.headerTitle}>
                    {formattedIdentifier}
                    <Star width={40} height={40} />
                </h1>
                <div className={classes.buttonContainer}>
                    <button className={classes.allButton} ref={allButton} onClick={() => setAttributeFilters(allKeys)}>
                        ALL {formattedIdentifier}
                    </button>
                    {itemList}
                </div>
            </div>
            <div className={classes.attributeGroupContainer}>
                <ShopByAttributeItems loading={loading} items={content} attributeFilter={attributeFilter} />
            </div>
        </Fragment>
    );
};

export default ShopByAttribute;
