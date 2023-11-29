import { shape, string } from 'prop-types';
import React from 'react';
import SlickSlider from 'react-slick';

import { LeftArrow, RightArrow } from '@app/components/Icons';
import AmProductLabelProvider from '@app/components/ProductLabels/context';
import { getDirection } from '@app/hooks/useDirection';
import { useCarousel } from '@app/pageBuilder/ContentTypes/Products/Carousel/useCarousel';
import Icon from '@magento/venia-ui/lib/components/Icon';

import GalleryItem from './galleryItem.js';
import classes from './slider.module.css';
import { useSlider } from './useSlider';

const Slider = props => {
    const { products, galleryItemClasses, nextArrow, prevArrow } = props;

    const { storeConfig } = useCarousel();
    const { handleProdutClick } = useSlider();

    const galleryItems = products.map(product => (
        <GalleryItem
            key={product.id}
            classes={galleryItemClasses}
            product={product}
            onItemClick={handleProdutClick}
            storeConfig={storeConfig}
        />
    ));

    /** These lines before settings are necessary in order to detect,
     whether to apply styles for 4 items and less in a large screen,
     because otherwise design looks wrong.
    */

    const settings = {
        slidesToShow: 5,
        slidesToScroll: 1,
        dotsClass: 'slick-line',
        dots: true,
        swipeToSlide: true,
        draggable: true,
        arrows: true,
        centerMode: false,
        infinite: false,
        prevArrow: prevArrow,
        nextArrow: nextArrow,
        dir: getDirection(),
        responsive: [
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerMode: true,
                    infinite: products.length > 1,
                    dots: true,
                    arrows: false
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerMode: true,
                    infinite: products.length > 2,
                    dots: true
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    centerMode: true,
                    infinite: products.length > 2,
                    dots: true
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    centerMode: true,
                    infinite: products.length > 2,
                    dots: true
                }
            }
        ]
    };

    return (
        <AmProductLabelProvider products={products} mode="CATEGORY">
            <div className={classes.root}>
                <div className={classes.slider}>
                    <SlickSlider {...settings}>{galleryItems}</SlickSlider>
                </div>
            </div>
        </AmProductLabelProvider>
    );
};

Slider.defaultProps = {
    slidesToShowLarge: 4.5,
    slidesToShowMedium: 2,
    slidesToShowSmall: 2,
    slidesToShowXSmall: 1,
    slidesToScroll: 1,
    prevArrow: <Icon src={LeftArrow} />,
    nextArrow: <Icon src={RightArrow} />
};

Slider.propTypes = {
    classes: shape({
        root: string,
        title: string
    })
};
export default Slider;
