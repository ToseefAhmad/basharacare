import classNames from 'classnames';
import { string, bool } from 'prop-types';
import React, { Fragment, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useBreadcrumbs } from '@magento/peregrine/lib/talons/Breadcrumbs/useBreadcrumbs';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './breadcrumbs.module.css';
import BreadcrumbsShimmer from './breadcrumbs.shimmer';

const DELIMITER = '/';
/**
 * Breadcrumbs! Generates a sorted display of category links.
 *
 * @param {String} props.categoryId the uid of the category for which to generate breadcrumbs
 * @param {String} props.currentProduct the name of the product we're currently on, if any.
 */
const Breadcrumbs = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const { categoryId, currentProduct, attributeoptionId, showShimmer } = props;

    const talonProps = useBreadcrumbs({ categoryId, attributeoptionId, showShimmer });

    const { currentCategory, currentCategoryPath, hasError, isLoading, normalizedData, handleClick } = talonProps;

    const delimiter = categoryId?.length ? <span className={classes.divider}>{DELIMITER}</span> : null;

    // For all links generate a fragment like "/ Text"
    const links = useMemo(() => {
        return normalizedData.map(({ text, path }) => {
            return (
                <Fragment key={text}>
                    <span className={classes.divider}>{DELIMITER}</span>
                    <Link className={classes.link} to={resourceUrl(path)} onClick={handleClick}>
                        {text}
                    </Link>
                </Fragment>
            );
        });
    }, [classes.divider, classes.link, handleClick, normalizedData]);

    if (isLoading || showShimmer) {
        return <BreadcrumbsShimmer classes={props.classes} />;
    }

    // Don't display anything but the empty, static height div when there's an error.

    if (hasError && !attributeoptionId) {
        return <div className={classes.root} aria-live="polite" aria-busy="false" />;
    }

    // If we have a "currentProduct" it means we're on a PDP so we want the last
    // Category text to be a link. If we don't have a "currentProduct" we're on
    // A category page so it should be regular text.
    const currentCategoryLink =
        currentProduct && categoryId ? (
            <Link className={classes.link} to={resourceUrl(currentCategoryPath)} onClick={handleClick}>
                {currentCategory}
            </Link>
        ) : (
            <span className={classes.currentCategory}>{currentCategory}</span>
        );

    const currentProductNode = currentProduct ? (
        <Fragment>
            {delimiter}
            <span className={classNames(classes.text, classes.currentProduct)}>{currentProduct}</span>
        </Fragment>
    ) : null;

    return (
        <div className={classes.root} aria-live="polite" aria-busy="false">
            <div className={classes.breadcrumbContainer}>
                <Link className={classes.link} to="/">
                    <FormattedMessage id="global.home" defaultMessage="Home" />
                </Link>
                {links}
                <span className={classes.divider}>{DELIMITER}</span>
                {currentCategoryLink}
                {currentProductNode}
                <span className={classes.attributeoptionId}>{attributeoptionId}</span>
            </div>
        </div>
    );
};

export default Breadcrumbs;

Breadcrumbs.propTypes = {
    categoryId: string,
    currentProduct: string,
    showShimmer: bool
};

Breadcrumbs.defaultProps = {
    showShimmer: false
};
