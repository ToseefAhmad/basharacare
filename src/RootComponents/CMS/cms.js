import { shape, string } from 'prop-types';
import React, { createContext, Fragment, useCallback, useEffect, useContext } from 'react';

import JsonLd from '@app/components/JsonLd';
import OpenGraph from '@app/components/OpenGraph';
import Breadcrumbs from '@app/components/overrides/Breadcrumbs';
import StyledHeading from '@app/components/StyledHeading';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { Meta, Title, Link } from '@magento/venia-ui/lib/components/Head';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import { toCamelCase } from '@magento/venia-ui/lib/util/toCamelCase';

const CmsPageContext = createContext();
const { Provider: CmsPageProvider } = CmsPageContext;

import defaultClasses from './cms.module.css';
import CMSPageShimmer from './cms.shimmer';
import { useCmsPage } from './useCmsPage';

const CMSPage = ({ identifier, ...restProps }) => {
    const talonProps = useCmsPage({ identifier });
    const { cmsPage, shouldShowLoadingIndicator } = talonProps;
    const classes = useStyle(defaultClasses, restProps.classes);
    const context = {
        pageType: identifier
    };

    const isRoutines = identifier === 'routines.html';
    const isHome = identifier === 'home';

    const removeBodyClass = useCallback(
        () => globalThis.document.body.classList.remove('cms-page', `cms-${identifier}`),
        [identifier]
    );

    useEffect(() => {
        scrollTo(0, 0);
    }, [identifier]);

    useEffect(() => {
        document.body.classList.add('cms-page', `cms-${identifier}`);
        return removeBodyClass;
    }, [identifier, removeBodyClass]);

    useEffect(() => {
        isRoutines && document.body.classList.add('cms-routines');
        return () => globalThis.document.body.classList.remove('cms-routines');
    }, [identifier, isRoutines]);

    if (shouldShowLoadingIndicator) {
        return <CMSPageShimmer />;
    }

    const {
        content_heading,
        title,
        meta_title,
        meta_description,
        meta_keywords,
        page_layout,
        content,
        canonical_url,
        hreflang_links,
        open_graph,
        rich_data
    } = cmsPage;

    const headingElement =
        content_heading !== '' ? (
            <div className={classes.headingContainer}>
                <StyledHeading title={content_heading} />
            </div>
        ) : null;

    const pageTitle = meta_title || title;
    const rootClassName = page_layout ? classes[`root_${toCamelCase(page_layout)}`] : classes.root;

    const canonicalUrl = `${origin}/${canonical_url}`;
    const keywordsElement = meta_keywords ? <Meta name="keywords" content={meta_keywords} /> : null;

    const hreflangLinksElement = hreflang_links
        ? hreflang_links.map(({ href, hreflang }) => {
              return <Link key={hreflang} rel="alternate" href={href} hreflang={hreflang} />;
          })
        : null;

    const JsonLdElements = Object.keys(rich_data).map(key => {
        if (rich_data[key] && key !== '__typename') {
            return <JsonLd key={key} data={rich_data[key]} />;
        }
    });
    const domainName = window?.location?.host?.replace('www.', '');

    const pageTitleWithDomain = isHome
        ? pageTitle
        : pageTitle + ' ' + domainName.charAt(0).toUpperCase() + domainName.slice(1);
    return (
        <Fragment>
            {JsonLdElements}
            <OpenGraph metaArray={open_graph} />
            <Title>{pageTitleWithDomain}</Title>
            <Link rel="canonical" href={canonicalUrl} />
            <Meta name="title" content={pageTitle} />
            <Meta name="description" content={meta_description} />
            {hreflangLinksElement}
            {keywordsElement}
            {isRoutines && (
                <Breadcrumbs
                    classes={{
                        root: classes.routineHtmlBreadcrumbRoot,
                        breadcrumbContainer: classes.routineHtmlBreadcrumbContainer,
                        breadcrumbShimmerRoot: classes.routineHtmlBreadcrumbShimmerContainer
                    }}
                    attributeoptionId="routines"
                />
            )}
            <CmsPageProvider value={context}>
                {headingElement}
                <article className={rootClassName}>
                    <RichContent html={content} />
                </article>
            </CmsPageProvider>
        </Fragment>
    );
};

CMSPage.propTypes = {
    identifier: string,
    classes: shape({
        root: string,
        heading: string,
        root_empty: string,
        root_1column: string,
        root_2columnsLeft: string,
        root_2columnsRight: string,
        root_3columns: string,
        root_cmsFullWidth: string,
        root_categoryFullWidth: string,
        root_productFullWidth: string
    })
};

export default CMSPage;

export const useCmsPageContext = () => useContext(CmsPageContext);
