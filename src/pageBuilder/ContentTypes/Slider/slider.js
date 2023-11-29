import { arrayOf, bool, node, number, oneOf, shape, string } from 'prop-types';
import React, { Children } from 'react';
import { ChevronLeft, ChevronRight } from 'react-feather';
import SlickSlider from 'react-slick';

import { Directions, getDirection } from '@app/hooks/useDirection';
import { useWindowSize } from '@magento/peregrine';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './slider.module.css';

const MIN_HEIGHT_RESIZE_COEFFICIENT = 0.85;
/**
 * Page Builder Slider component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Slider
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Slider which contains slides.
 */
const Slider = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const isMobile = useWindowSize().innerWidth < 1024;
    const {
        minHeight,
        autoplay,
        autoplaySpeed,
        fade,
        infinite,
        showArrows,
        showDots,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = [],
        children
    } = props;

    const mobileMinHeightUnitOfMeasure = minHeight.replace(/\d/g, '');
    const mobileMinHeightFormatted =
        minHeight.replace(/\D/g, '') * MIN_HEIGHT_RESIZE_COEFFICIENT + mobileMinHeightUnitOfMeasure;

    const responsiveHeight = !isMobile ? minHeight : mobileMinHeightFormatted;
    const dynamicStyles = {
        minHeight: responsiveHeight,
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft
    };

    const dots = dots => {
        return <ul className={classes.dots}>{dots}</ul>;
    };

    const ArrowLeft = ({ className, style, onClick }) => {
        return (
            <button className={className} style={{ ...style }} onClick={onClick}>
                <Icon src={ChevronLeft} size={30} />
            </button>
        );
    };

    const ArrowRight = ({ className, style, onClick }) => {
        return (
            <button className={className} style={{ ...style }} onClick={onClick}>
                <Icon src={ChevronRight} size={30} />
            </button>
        );
    };

    const sliderSettings = {
        prevArrow: <ArrowLeft />,
        nextArrow: <ArrowRight />,
        dots: showDots,
        arrows: showArrows,
        lazyLoad: true,
        infinite,
        autoplay,
        autoplaySpeed,
        fade
    };

    const isRtlDirection = getDirection() === Directions.rtl;

    if (cssClasses.includes('reviews-slider')) {
        const reviewsSliderSettings = {
            dotsClass: 'slick-line',
            appendDots: dots,
            rtl: isRtlDirection
        };

        Object.assign(sliderSettings, reviewsSliderSettings);
    }

    // Override classes on banner to ensure min height is respected
    Children.map(children, child => {
        if (child.props && child.props.data) {
            child.props.data.classes = {
                root: classes.bannerRoot,
                link: classes.bannerLink,
                wrapper: classes.bannerWrapper,
                posterOverlay: classes.bannerPosterOverlay
            };
        }
        return child;
    });

    return (
        <div
            aria-live="assertive"
            aria-busy="false"
            className={[classes.root, ...cssClasses].join(' ')}
            style={dynamicStyles}
        >
            <SlickSlider {...sliderSettings}>{children}</SlickSlider>
        </div>
    );
};

/**
 * Props for {@link Slider}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the Slider
 * @property {String} classes.root CSS class for the slider root element
 * @property {String} classes.bannerRoot CSS class for the child banner item
 * @property {String} classes.bannerLink CSS class for the child banner item
 * @property {String} classes.bannerWrapper CSS class for the child banner item
 * @property {String} classes.bannerPosterOverlay CSS class for the child banner item
 * @property {String} minHeight CSS minimum height property
 * @property {String} autoplay Whether the slider should autoplay
 * @property {String} autoplaySpeed The speed at which the autoplay should move the slide on
 * @property {String} fade Fade between slides
 * @property {String} infinite Whether to infinitely scroll the slider
 * @property {String} showArrows Whether to show arrows on the slide for navigation
 * @property {String} showDots Whether to show navigation dots at the bottom of the slider
 * @property {String} textAlign Alignment of content within the slider
 * @property {String} border CSS border property
 * @property {String} borderColor CSS border color property
 * @property {String} borderWidth CSS border width property
 * @property {String} borderRadius CSS border radius property
 * @property {String} marginTop CSS margin top property
 * @property {String} marginRight CSS margin right property
 * @property {String} marginBottom CSS margin bottom property
 * @property {String} marginLeft CSS margin left property
 * @property {String} paddingTop CSS padding top property
 * @property {String} paddingRight CSS padding right property
 * @property {String} paddingBottom CSS padding bottom property
 * @property {String} paddingLeft CSS padding left property
 * @property {Array} cssClasses List of CSS classes to be applied to the component
 */
Slider.propTypes = {
    classes: shape({
        root: string,
        bannerRoot: string,
        bannerLink: string,
        bannerWrapper: string,
        bannerPosterOverlay: string
    }),
    appearance: oneOf(['default']),
    minHeight: string,
    autoplay: bool,
    autoplaySpeed: number,
    fade: bool,
    infinite: bool,
    showArrows: bool,
    showDots: bool,
    textAlign: string,
    border: string,
    borderColor: string,
    borderWidth: string,
    borderRadius: string,
    marginTop: string,
    marginRight: string,
    marginBottom: string,
    marginLeft: string,
    paddingTop: string,
    paddingRight: string,
    paddingBottom: string,
    paddingLeft: string,
    cssClasses: arrayOf(string),
    children: node
};

export default Slider;
