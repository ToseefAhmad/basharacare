/* eslint-disable react/jsx-no-target-blank */
import React from 'react';
import { FormattedMessage } from 'react-intl';
import SlickSlider from 'react-slick';

import { LeftArrow, RightArrow } from '@app/components/Icons';
import Instagram from '@app/components/Icons/instagram';
import { Directions, getDirection } from '@app/hooks/useDirection';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import SimpleImage from '@magento/venia-ui/lib/components/Image/simpleImage';

import defaultClasses from './instagram-feed.module.css';
import { useInstagramFeed } from './useInstagramFeed';

/**
 *
 * @returns {JSX.Element|null}
 * @constructor
 */
const InstagramFeed = props => {
    const {
        slidesToShowLarge,
        slidesToShowMedium,
        slidesToShowSmall,
        slidesToShowXSmall,
        slidesToScroll,
        linkPath
    } = props;

    const { items } = useInstagramFeed(props);
    const classes = useStyle(defaultClasses, props.classes);

    const content = items.map(item => {
        return (
            <a target="_blank" key={item.post_id} href={item.permalink}>
                <SimpleImage loading="lazy" alt={item.caption || 'Instagram Image'} src={item.media_url} />
            </a>
        );
    });
    const isRtlDirection = getDirection() === Directions.rtl;
    const currentSlidesLarge = items.length <= slidesToShowLarge ? items.length : slidesToShowLarge;
    const currentSlidesMedium = items.length <= slidesToShowMedium ? items.length : slidesToShowMedium;
    const currentSlidesSmall = items.length <= slidesToShowSmall ? items.length : slidesToShowSmall;
    const currentSlidesXSmall = items.length <= slidesToShowXSmall ? items.length : slidesToShowXSmall;

    const settings = {
        slidesToShow: currentSlidesLarge,
        slidesToScroll,
        dots: false,
        arrows: false,
        centerMode: false,
        swipeToSlide: false,
        infinite: true,
        draggable: true,
        lazyLoad: true,
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: currentSlidesMedium,
                    slidesToScroll,
                    centerMode: false
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: currentSlidesSmall,
                    slidesToScroll,
                    centerMode: false
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: currentSlidesXSmall,
                    slidesToScroll,
                    className: 'center',
                    centerMode: true
                }
            }
        ]
    };

    const title = (
        <div className={classes.title}>
            <div className={classes.titleBold}>
                <FormattedMessage
                    id="instagramFeed.title"
                    defaultMessage="<b>Let's be</b> <i>friends</i> {icon}"
                    values={{
                        b: chunks => <strong>{chunks}</strong>,
                        i: chunks => <span>{chunks}</span>,
                        icon: <Instagram />
                    }}
                />
            </div>
            <div className={classes.titleWrapper}>
                <span>
                    <FormattedMessage
                        id="instagramFeed.description"
                        defaultMessage="Commit to yourself every single day with {link}"
                        values={{
                            link: (
                                <a href={linkPath} target="_blank">
                                    @BASHARACARE <Icon src={isRtlDirection ? LeftArrow : RightArrow} />
                                </a>
                            )
                        }}
                    />
                </span>
            </div>
        </div>
    );

    return (
        <div className={classes.root}>
            {title}
            <div className={classes.slider}>
                <SlickSlider {...settings}>{content}</SlickSlider>
            </div>
        </div>
    );
};

InstagramFeed.defaultProps = {
    prevArrow: <Icon src={LeftArrow} />,
    nextArrow: <Icon src={RightArrow} />,
    slidesToShowLarge: 3.7,
    slidesToShowMedium: 2.5,
    slidesToShowSmall: 1,
    slidesToShowXSmall: 1,
    slidesToScroll: 1,
    linkPath: '/'
};

export default InstagramFeed;
