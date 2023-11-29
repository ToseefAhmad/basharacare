import { shape, string } from 'prop-types';
import React, { useMemo } from 'react';
import SlickSlider from 'react-slick';

import { LeftArrow, RightArrow } from '@app/components/Icons';
import AmProductLabelProvider from '@app/components/ProductLabels/context';
import { useCarousel } from '@app/pageBuilder/ContentTypes/Products/Carousel/useCarousel';
import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import GalleryItem from './galleryItem.js';
import defaultClasses from './slider.module.css';
import { useSlider } from './useSlider';

const Slider = props => {
    const {
        title,
        products,
        galleryItemClasses,
        slidesToShowLarge,
        slidesToShowMedium,
        slidesToShowSmall,
        slidesToShowXSmall,
        slidesToScroll,
        nextArrow: nextArrow,
        prevArrow: prevArrow,
        propSettings,
        innerTitle,
        ...rest
    } = props;
    const { handleProductClick } = useSlider();
    const { innerWidth } = useWindowSize();
    const classes = useStyle(defaultClasses, props.classes);
    const { storeConfig } = useCarousel();

    const galleryItems = useMemo(
        () =>
            products.map(product => (
                <GalleryItem
                    {...rest}
                    key={product.id}
                    classes={galleryItemClasses}
                    product={product}
                    onItemClick={handleProductClick}
                    storeConfig={storeConfig}
                />
            )),
        [rest, galleryItemClasses, handleProductClick, storeConfig, products]
    );

    const currentSlidesLarge = galleryItems.length <= slidesToShowLarge ? galleryItems.length : slidesToShowLarge;
    const currentSlidesMedium = galleryItems.length <= slidesToShowMedium ? galleryItems.length : slidesToShowMedium;
    const currentSlidesSmall = galleryItems.length <= slidesToShowSmall ? galleryItems.length : slidesToShowSmall;
    const currentSlidesXSmall = galleryItems.length <= slidesToShowXSmall ? galleryItems.length : slidesToShowXSmall;
    const centerMode = galleryItems.length < slidesToShowLarge;
    const applyStylesForFewerItems = currentSlidesLarge < slidesToShowLarge && innerWidth > 640;

    const settings = propSettings
        ? propSettings
        : {
              slidesToShow: currentSlidesLarge,
              slidesToScroll: 1,
              dotsClass: 'slick-line',
              dots: true,
              swipeToSlide: false,
              draggable: true,
              arrows: true,
              centerMode: centerMode,
              infinite: true,
              prevArrow: prevArrow,
              nextArrow: nextArrow,
              responsive: [
                  {
                      breakpoint: 1024,
                      settings: {
                          slidesToShow: currentSlidesMedium,
                          slidesToScroll,
                          swipeToSlide: true,
                          draggable: true,
                          arrows: true,
                          centerMode: false,
                          infinite: true
                      }
                  },
                  {
                      breakpoint: 640,
                      settings: {
                          slidesToShow: currentSlidesSmall,
                          slidesToScroll,
                          swipeToSlide: true,
                          draggable: true,
                          arrows: false,
                          centerMode: false,
                          infinite: true
                      }
                  },
                  {
                      breakpoint: 500,
                      settings: {
                          slidesToShow: currentSlidesXSmall,
                          centerPadding: '60px',
                          swipeToSlide: true,
                          slidesToScroll,
                          className: 'center',
                          draggable: true,
                          arrows: false,
                          centerMode: true,
                          infinite: true
                      }
                  }
              ]
          };

    return (
        <AmProductLabelProvider products={products} mode="CATEGORY">
            <div className={classes.root}>
                <div className={classes.title}>{title}</div>
                <div className={applyStylesForFewerItems ? classes.lessItemsSlider : classes.slider}>
                    <div className={classes.innerTitle}>{innerTitle}</div>
                    <SlickSlider {...settings}>{galleryItems}</SlickSlider>
                </div>
            </div>
        </AmProductLabelProvider>
    );
};

Slider.defaultProps = {
    prevArrow: <Icon src={LeftArrow} />,
    nextArrow: <Icon src={RightArrow} />,
    slidesToShowLarge: 4.5,
    slidesToShowMedium: 3,
    slidesToShowSmall: 2,
    slidesToShowXSmall: 1,
    slidesToScroll: 1
};

Slider.propTypes = {
    classes: shape({
        root: string,
        title: string
    })
};
export default Slider;
