import { arrayOf, bool, oneOf, shape, string, func } from 'prop-types';
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Link } from 'react-router-dom';

import resolveLinkProps from '@magento/pagebuilder/lib/resolveLinkProps';
import { useWindowSize } from '@magento/peregrine';
import useIntersectionObserver from '@magento/peregrine/lib/hooks/useIntersectionObserver';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Button from '@magento/venia-ui/lib/components/Button/button';

import defaultClasses from './banner.module.css';

const { matchMedia } = globalThis;
const toHTML = str => ({ __html: str });
const handleDragStart = event => event.preventDefault();
const MIN_HEIGHT_RESIZE_COEFFICIENT = 0.85;
/**
 * Page Builder Banner component.
 *
 * This component is part of the Page Builder / PWA integration. It can be consumed without Page Builder.
 *
 * @typedef Banner
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element} A React component that displays a Banner.
 */
const Banner = props => {
    const backgroundElement = useRef(null);
    const viewportElement = useRef(null);
    const classes = useStyle(defaultClasses, props.classes);
    const [hovered, setHovered] = useState(false);
    const [bgImageStyle, setBgImageStyle] = useState(null);
    const toggleHover = () => setHovered(!hovered);
    const intersectionObserver = useIntersectionObserver();
    const isMobile = useWindowSize().innerWidth < 1024;
    const {
        appearance = 'poster',
        minHeight,
        backgroundColor,
        desktopImage,
        mobileImage,
        backgroundSize,
        backgroundPosition,
        backgroundAttachment,
        backgroundRepeat = 'repeat',
        textAlign,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        content,
        showButton,
        buttonType,
        buttonText,
        link,
        openInNewTab = false,
        showOverlay,
        overlayColor,
        marginTop,
        marginRight,
        marginBottom,
        marginLeft,
        paddingTop,
        paddingRight,
        paddingBottom,
        paddingLeft,
        cssClasses = [],
        backgroundType,
        videoOverlayColor
    } = props;

    let image = desktopImage;
    if (mobileImage && matchMedia && !matchMedia('(min-width: 768px)').matches) {
        image = mobileImage;
    }

    const rootStyles = {
        marginTop,
        marginRight,
        marginBottom,
        marginLeft
    };
    const wrapperStyles = {
        backgroundColor,
        border,
        borderColor,
        borderWidth,
        borderRadius,
        textAlign
    };
    const overlayStyles = {
        backgroundColor: showOverlay !== 'never' ? overlayColor : null
    };
    const contentStyles = {};

    const videoOverlayStyles = {
        backgroundColor: videoOverlayColor
    };

    const mobileMinHeightUnitOfMeasure = minHeight.replace(/\d/g, '');
    const mobileMinHeightFormatted =
        minHeight.replace(/\D/g, '') * MIN_HEIGHT_RESIZE_COEFFICIENT + mobileMinHeightUnitOfMeasure;

    const responsiveHeight = !isMobile ? minHeight : mobileMinHeightFormatted;

    if (image && bgImageStyle) {
        wrapperStyles.backgroundImage = `url(${bgImageStyle})`;
        wrapperStyles.backgroundSize = backgroundSize;
        wrapperStyles.backgroundPosition = isMobile ? 'center bottom' : backgroundPosition;
        wrapperStyles.backgroundAttachment = backgroundAttachment;
        wrapperStyles.backgroundRepeat = backgroundRepeat;
    }

    const setBgImage = useCallback(() => {
        const resourceImage = resourceUrl(image, {
            type: 'image-wysiwyg',
            quality: 85
        });

        const backgroundImage = document.createElement('img');
        backgroundImage.src = resourceImage;
        setBgImageStyle(resourceImage);
    }, [image]);

    // Load image only if in viewport
    useEffect(() => {
        if (!image || !backgroundElement.current) {
            return;
        }

        // Fallback if IntersectionObserver is not supported
        if (typeof intersectionObserver === 'undefined') {
            setBgImage();
            return;
        }

        const htmlElement = backgroundElement.current;

        const onIntersection = entries => {
            if (entries.some(entry => entry.isIntersecting)) {
                observer.unobserve(htmlElement);

                setBgImage();
            }
        };
        const observer = new intersectionObserver(onIntersection);
        observer.observe(htmlElement);

        return () => {
            if (htmlElement) {
                observer.unobserve(htmlElement);
            }
        };
    }, [backgroundElement, image, intersectionObserver, setBgImage]);

    if (appearance === 'poster') {
        wrapperStyles.minHeight = responsiveHeight;
        overlayStyles.minHeight = responsiveHeight;
        overlayStyles.paddingTop = paddingTop;
        overlayStyles.paddingRight = paddingRight;
        overlayStyles.paddingBottom = paddingBottom;
        overlayStyles.paddingLeft = paddingLeft;
        contentStyles.width = '100%';
    } else {
        wrapperStyles.minHeight = responsiveHeight;
        wrapperStyles.paddingTop = paddingTop;
        wrapperStyles.paddingRight = paddingRight;
        wrapperStyles.paddingBottom = paddingBottom;
        wrapperStyles.paddingLeft = paddingLeft;
    }

    const appearanceOverlayClasses = {
        poster: classes.posterOverlay,
        'collage-left': classes.collageLeftOverlay,
        'collage-centered': classes.collageCenteredOverlay,
        'collage-right': classes.collageRightOverlay
    };
    const appearanceOverlayHoverClasses = {
        poster: classes.posterOverlayHover,
        'collage-left': classes.collageLeftOverlayHover,
        'collage-centered': classes.collageCenteredOverlayHover,
        'collage-right': classes.collageRightOverlayHover
    };

    const typeToPriorityMapping = {
        primary: 'high',
        secondary: 'normal',
        link: 'low'
    };

    let BannerButton;
    if (showButton !== 'never') {
        const buttonClass = showButton === 'hover' ? classes.buttonHover : classes.button;

        BannerButton = (
            <div className={buttonClass}>
                <Button priority={typeToPriorityMapping[buttonType]} type="button">
                    {buttonText}
                </Button>
            </div>
        );
    }

    const videoOverlay = videoOverlayColor ? <div className={classes.videoOverlay} style={videoOverlayStyles} /> : null;
    const videoViewportElement =
        backgroundType === 'video' ? <div ref={viewportElement} className={classes.viewportElement} /> : null;

    const overlayClass =
        showOverlay === 'hover' && !hovered
            ? appearanceOverlayHoverClasses[appearance]
            : appearanceOverlayClasses[appearance];

    const ContentBannerFragment = (
        <div className={classes.wrapper} style={wrapperStyles} ref={backgroundElement}>
            {videoOverlay}
            <div className={overlayClass} style={overlayStyles}>
                <div className={classes.content} style={contentStyles} dangerouslySetInnerHTML={toHTML(content)} />
                {BannerButton}
            </div>
            {videoViewportElement}
        </div>
    );

    let ImageBannerFragment;
    if (!content) {
        const resourceImage = resourceUrl(image, {
            type: 'image-wysiwyg',
            quality: 100
        });

        // eslint-disable-next-line jsx-a11y/alt-text
        ImageBannerFragment = <img src={resourceImage} />;
    }

    let BannerFragment = ImageBannerFragment || ContentBannerFragment;

    if (typeof link === 'string') {
        const linkProps = resolveLinkProps(link);
        const LinkComponent = linkProps.to ? Link : 'a';
        BannerFragment = (
            <LinkComponent
                className={classes.link}
                {...linkProps}
                {...(openInNewTab ? { target: '_blank' } : '')}
                onDragStart={handleDragStart}
            >
                {BannerFragment}
            </LinkComponent>
        );
    }

    return (
        <div
            aria-live="assertive"
            aria-busy="false"
            className={[classes.root, ...cssClasses].join(' ')}
            style={rootStyles}
            onMouseEnter={toggleHover}
            onMouseLeave={toggleHover}
        >
            {BannerFragment}
        </div>
    );
};

/**
 * Props for {@link Banner}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the banner
 * @property {String} classes.root CSS class for the banner root element
 * @property {String} classes.link CSS class for the banner link element
 * @property {String} classes.wrapper CSS class for the banner wrapper element
 * @property {String} classes.overlay CSS class for the banner overlay element
 * @property {String} classes.content CSS class for the banner content element
 * @property {String} classes.button CSS class for the banner button wrapping element
 * @property {String} classes.buttonHover CSS class for the banner button wrapping element for hover
 * @property {String} classes.posterOverlay CSS class for the banner poster appearance overlay
 * @property {String} classes.collageLeftOverlay CSS class for the banner collage left appearance overlay
 * @property {String} classes.collageCenteredOverlay CSS class for the banner collage centered appearance overlay
 * @property {String} classes.collageRightOverlay CSS class for the banner collage right appearance overlay
 * @property {String} classes.posterOverlayHover CSS class for the banner poster appearance overlay hover
 * @property {String} classes.collageLeftOverlayHover CSS class for the banner collage left appearance overlay hover
 * @property {String} classes.collageCenteredOverlayHover CSS class for the banner collage centered appearance overlay hover
 * @property {String} classes.collageRightOverlayHover CSS class for the banner collage right appearance overlay hover
 * @property {String} classes.poster CSS class for the banner poster appearance
 * @property {String} classes.videoOverlay CSS class for the video overlay
 * @property {String} classes.viewportElement CSS class for viewport element
 * @property {String} minHeight CSS minimum height property
 * @property {String} backgroundColor CSS background-color property
 * @property {String} desktopImage Background image URL to be displayed on desktop devices
 * @property {String} mobileImage Background image URL to be displayed on mobile devices
 * @property {String} backgroundSize CSS background-size property
 * @property {String} backgroundPosition CSS background-position property
 * @property {String} backgroundAttachment CSS background-attachment property
 * @property {String} backgroundRepeat CSS background-repeat property
 * @property {String} content The HTML content to be rendered inside the banner content area
 * @property {String} link The link location for the banner
 * @property {String} linkType The type of link included with the banner. Values: default, product, category, page
 * @property {String} showButton Whether or not to show the button. Values: always, hover, never
 * @property {String} buttonText Text to display within the button
 * @property {String} buttonType The type of button to display. Values: primary, secondary, link
 * @property {String} showOverlay Whether or not to show the overlay. Values: always, hover, never
 * @property {String} overlayColor The color of the overlay
 * @property {String} textAlign Alignment of the banner within the parent container
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
 * @property {String} backgroundType Background type
 * @property {String} videoSrc URL to the video
 * @property {String} videoFallbackSrc URL to the image which will be displayed before video
 * @property {Boolean} videoLoop Play video in loop
 * @property {Boolean} videoPlayOnlyVisible Play video when it is visible
 * @property {Boolean} videoLazyLoading Load video when it is visible
 * @property {String} videoOverlayColor Color for video overlay
 * @property {Function} getParallax Return parallax element and options
 */
Banner.propTypes = {
    classes: shape({
        root: string,
        link: string,
        wrapper: string,
        overlay: string,
        content: string,
        button: string,
        buttonHover: string,
        posterOverlay: string,
        posterOverlayHover: string,
        collageLeftOverlay: string,
        collageLeftOverlayHover: string,
        collageCenteredOverlay: string,
        collageCenteredOverlayHover: string,
        collageRightOverlay: string,
        collageRightOverlayHover: string,
        videoOverlay: string,
        viewportElement: string
    }),
    appearance: oneOf(['poster', 'collage-left', 'collage-centered', 'collage-right']),
    minHeight: string,
    backgroundColor: string,
    desktopImage: string,
    mobileImage: string,
    backgroundSize: string,
    backgroundPosition: string,
    backgroundAttachment: string,
    backgroundRepeat: string,
    content: string,
    link: string,
    linkType: oneOf(['default', 'product', 'category', 'page']),
    openInNewTab: bool,
    showButton: oneOf(['always', 'hover', 'never']),
    buttonText: string,
    buttonType: oneOf(['primary', 'secondary', 'link']),
    showOverlay: oneOf(['always', 'hover', 'never']),
    overlayColor: string,
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
    backgroundType: string,
    videoSrc: string,
    videoFallbackSrc: string,
    videoLoop: bool,
    videoPlayOnlyVisible: bool,
    videoLazyLoading: bool,
    videoOverlayColor: string,
    getParallax: func
};

export default Banner;
