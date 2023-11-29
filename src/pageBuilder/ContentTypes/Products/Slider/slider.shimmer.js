import React from 'react';
import SlickSlider from 'react-slick';

import { LeftArrow, RightArrow } from '@app/components/Icons';
import { getDirection } from '@app/hooks/useDirection';
import { useWindowSize } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './slider.module.css';

const MOBILE_GALLERY_ITEM_WIDTH = '253px';
const SliderShimmer = props => {
    const { products, galleryItemWidth, galleryItemHeight, nextArrow, prevArrow } = props;

    const isMobile = useWindowSize().innerWidth < 1024;

    const responsiveGalleryItemWidth = isMobile ? MOBILE_GALLERY_ITEM_WIDTH : galleryItemWidth;
    const classes = useStyle(defaultClasses, props.classes);

    const galleryItems = products.map((product, index) => (
        <Shimmer key={index} height={galleryItemHeight} width={responsiveGalleryItemWidth} />
    ));

    const settings = {
        slidesToShow: 5,
        slidesToScroll: 1,
        dotsClass: 'slick-line',
        dots: false,
        swipeToSlide: true,
        draggable: true,
        arrows: true,
        centerMode: false,
        infinite: true,
        lazyLoad: true,
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
                    infinite: true,
                    dots: false
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    centerMode: true,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 1,
                    centerMode: true,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 1200,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 1,
                    centerMode: true,
                    infinite: true,
                    dots: true
                }
            }
        ]
    };

    return (
        <div className={classes.shimmerRoot}>
            <div className={classes.sliderShimmer}>
                <SlickSlider {...settings}>{galleryItems}</SlickSlider>
            </div>
        </div>
    );
};

SliderShimmer.defaultProps = {
    products: [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }, { id: 5 }],
    slidesToShowLarge: 4.5,
    slidesToShowMedium: 3,
    slidesToShowSmall: 2,
    slidesToShowXSmall: 1,
    slidesToScroll: 1,
    galleryItemWidth: '220px',
    galleryItemHeight: 20,
    prevArrow: <Icon src={LeftArrow} />,
    nextArrow: <Icon src={RightArrow} />
};

export default SliderShimmer;
