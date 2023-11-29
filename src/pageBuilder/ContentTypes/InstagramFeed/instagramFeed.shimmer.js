import React from 'react';
import SlickSlider from 'react-slick';

import { Directions, getDirection } from '@app/hooks/useDirection';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './instagram-feed.module.css';

const InstagramFeedShimmer = ({
    slidesToShowLarge,
    slidesToShowMedium,
    slidesToShowSmall,
    slidesToShowXSmall,
    galleryItemWidth,
    galleryItemHeight,
    slidesToScroll
}) => {
    const instagramFeeds = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

    const classes = useStyle(defaultClasses);

    const galleryItems = instagramFeeds.map((product, index) => (
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
        dots: false,
        arrows: false,
        centerMode: false,
        swipeToSlide: true,
        infinite: true,
        rtl: isRtlDirection,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: currentSlidesMedium,
                    slidesToScroll,
                    swipeToSlide: true
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: currentSlidesSmall,
                    slidesToScroll,
                    swipeToSlide: true
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: currentSlidesXSmall,
                    swipeToSlide: true,
                    slidesToScroll,
                    className: 'center',
                    centerMode: true
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

InstagramFeedShimmer.defaultProps = {
    slidesToShowLarge: 3.7,
    slidesToShowMedium: 2.6,
    slidesToShowSmall: 1,
    slidesToShowXSmall: 1,
    slidesToScroll: 1,
    galleryItemWidth: 17,
    galleryItemHeight: 17
};

export default InstagramFeedShimmer;
