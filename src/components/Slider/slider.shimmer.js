import React from 'react';
import SlickSlider from 'react-slick';

import { LeftArrow, RightArrow } from '@app/components/Icons';
import { Directions, getDirection } from '@app/hooks/useDirection';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './slider.module.css';

const SliderShimmer = props => {
    const {
        products,
        slidesToShowLarge,
        slidesToShowMedium,
        slidesToShowSmall,
        slidesToShowXSmall,
        galleryItemWidth,
        galleryItemHeight,
        slidesToScroll,
        nextArrow,
        prevArrow
    } = props;

    const classes = useStyle(defaultClasses, props.classes);

    const galleryItems = products.map((product, index) => (
        <Shimmer key={index} height={galleryItemHeight} width={galleryItemWidth} />
    ));

    const isRtlDirection = getDirection() === Directions.rtl;

    const currentSlidesLarge = galleryItems.length <= slidesToShowLarge ? galleryItems.length : slidesToShowLarge;
    const currentSlidesMedium = galleryItems.length <= slidesToShowMedium ? galleryItems.length : slidesToShowMedium;
    const currentSlidesSmall = galleryItems.length <= slidesToShowSmall ? galleryItems.length : slidesToShowSmall;
    const currentSlidesXSmall = galleryItems.length <= slidesToShowXSmall ? galleryItems.length : slidesToShowXSmall;

    const settings = {
        slidesToShow: currentSlidesLarge,
        slidesToScroll: 1,
        dotsClass: 'slick-line',
        dots: true,
        swipeToSlide: true,
        draggable: true,
        arrows: true,
        centerMode: false,
        infinite: true,
        lazyLoad: true,
        prevArrow: prevArrow,
        nextArrow: nextArrow,
        rtl: isRtlDirection,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: currentSlidesMedium,
                    slidesToScroll,
                    draggable: true,
                    arrows: false,
                    centerMode: false,
                    infinite: true
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: currentSlidesSmall,
                    slidesToScroll,
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
        <div className={classes.root}>
            <div className={classes.title}>
                <Shimmer height={3} width={10} key="related-products-title" />
            </div>
            <div className={classes.slider}>
                <SlickSlider {...settings}>{galleryItems}</SlickSlider>
            </div>
        </div>
    );
};

SliderShimmer.defaultProps = {
    slidesToShowLarge: 4.5,
    slidesToShowMedium: 3,
    slidesToShowSmall: 2,
    slidesToShowXSmall: 1,
    slidesToScroll: 1,
    galleryItemWidth: 15,
    galleryItemHeight: 21.75,
    prevArrow: <Icon src={LeftArrow} />,
    nextArrow: <Icon src={RightArrow} />
};

export default SliderShimmer;
