/* eslint-disable react/jsx-no-target-blank */
import { string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { Arrow } from '@app/components/Icons';
import { useWindowSize } from '@magento/peregrine';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import SimpleImage from '@magento/venia-ui/lib/components/Image/simpleImage';

import classes from './brandsSlider.module.css';
import BrandsSliderShimmer from './brandsSlider.shimmer';
import { useBrandsSlider } from './useBrandsSlider';

/**
 *
 * @returns {JSX.Element|null}
 * @constructor
 */
const BrandsSlider = props => {
    const { items, allBrands, isLoading } = useBrandsSlider(props);

    const isMobile = useWindowSize().innerWidth < 1024;

    if (isLoading || !items) return <BrandsSliderShimmer />;
    if (items.length === 0) return null;

    const brands = items.map(item => (
        <Link key={item.option_setting_id} to={item.url_alias} className={classes.imageContainer}>
            <SimpleImage
                loading="lazy"
                alt={item.small_image_alt || ''}
                src={
                    item.slider_image
                        ? resourceUrl(item.slider_image, {
                              type: 'image-amasty',
                              height: '60',
                              fit: 'contain'
                          })
                        : null
                }
            />
        </Link>
    ));

    const seeMoreContent = !isMobile ? (
        <>
            <FormattedMessage id="BrandsSlider.seeMore" defaultMessage="See all Brands" />
            <Arrow />
        </>
    ) : (
        <>
            <FormattedMessage id="BrandsSlider.seeMoreMobile" defaultMessage="See all" />
        </>
    );
    const brandsLink = (
        <div className={classes.brandsLink}>
            <Link to={allBrands}>{seeMoreContent}</Link>
        </div>
    );
    return (
        <div className={classes.brandsSlider}>
            <div className={classes.slider}>{brands}</div>
            {brandsLink}
        </div>
    );
};

BrandsSlider.prototypes = {
    linkPath: string,
    showItems: string
};

export default BrandsSlider;
