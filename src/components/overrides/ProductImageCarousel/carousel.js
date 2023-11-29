import { arrayOf, bool, number, shape, string } from 'prop-types';
import React, { useState, useMemo } from 'react';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'react-feather';
import { useIntl } from 'react-intl';
import { useSwipeable } from 'react-swipeable';
import { TransitionGroup, CSSTransition } from 'react-transition-group';

import { AuthorizedRetailer } from '@app/components/Icons';
import AmProductLabels from '@app/components/ProductLabels';
import { getDirection, Directions } from '@app/hooks/useDirection';
import { useProductImageCarousel } from '@magento/peregrine/lib/talons/ProductImageCarousel/useProductImageCarousel';
import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useStyle } from '@magento/venia-ui/lib/classify';
import AriaButton from '@magento/venia-ui/lib/components/AriaButton';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Image from '@magento/venia-ui/lib/components/Image';
import Thumbnail from '@magento/venia-ui/lib/components/ProductImageCarousel/thumbnail';

import defaultClasses from './carousel.module.css';

const IMAGE_WIDTH = 640;

/**
 * Carousel component for product images
 * Carousel - Component that holds number of images
 * where typically one image visible, and other
 * images can be navigated through previous and next buttons
 *
 * @typedef ProductImageCarousel
 * @kind functional component
 *
 * @param {props} props
 *
 * @returns {React.Element} React carousel component that displays a product image
 */
const ProductImageCarousel = props => {
    const { images } = props;
    const { formatMessage } = useIntl();
    const talonProps = useProductImageCarousel({
        images,
        imageWidth: IMAGE_WIDTH
    });

    const {
        currentImage,
        activeItemIndex,
        altText,
        handleNext,
        handlePrevious,
        handleThumbnailClick,
        sortedImages
    } = talonProps;

    // Check if store layout direction is right to left.
    const isRtl = getDirection() === Directions.rtl;

    // Create thumbnail image component for every images in sorted order
    const thumbnails = useMemo(
        () =>
            sortedImages.length > 1
                ? sortedImages.map((item, index) => (
                      <Thumbnail
                          key={item.uid}
                          item={item}
                          itemIndex={index}
                          isActive={activeItemIndex === index}
                          onClickHandler={handleThumbnailClick}
                      />
                  ))
                : null,
        [activeItemIndex, handleThumbnailClick, sortedImages]
    );

    const classes = useStyle(defaultClasses, props.classes);

    const disableHandlePreviousButton = () => {
        return activeItemIndex === 0;
    };

    const disableHandleNextButton = () => {
        return images.length === activeItemIndex + 1;
    };

    // Set direction from which image appears
    const [direction, setDirection] = useState('left');

    const showPrevImage = () => {
        setDirection('left');
        if (!disableHandlePreviousButton()) handlePrevious();
    };

    const showNextImage = () => {
        setDirection('right');
        if (!disableHandleNextButton()) handleNext();
    };

    let transitionClasses;
    if (direction === 'left') {
        transitionClasses = {
            enter: classes.fromLeftEnter,
            enterActive: classes.fromLeftEnterActive,
            exitActive: classes.fromLeftExitActive
        };
    } else {
        transitionClasses = {
            enter: classes.fromRightEnter,
            enterActive: classes.fromRightEnterActive,
            exitActive: classes.fromRightExitActive
        };
    }

    let image;

    if (currentImage.file) {
        image = (
            <CSSTransition
                key={currentImage.file}
                in={true}
                classNames={transitionClasses}
                timeout={{ enter: 700, exit: 700 }}
            >
                <div className={classes.imageContainer}>
                    <Image
                        alt={altText}
                        classes={{
                            image: classes.currentImage
                        }}
                        resource={currentImage.file}
                        width={IMAGE_WIDTH}
                    />
                </div>
            </CSSTransition>
        );
    } else {
        image = (
            <div className={classes.imageContainer}>
                <Image
                    alt={altText}
                    classes={{
                        image: classes.currentImage_placeholder,
                        root: classes.imageContainer
                    }}
                    src={transparentPlaceholder}
                />
            </div>
        );
    }

    const previousButton = formatMessage({
        id: 'productImageCarousel.previousButtonAriaLabel',
        defaultMessage: 'Previous Image'
    });

    const nextButton = formatMessage({
        id: 'productImageCarousel.nextButtonAriaLabel',
        defaultMessage: 'Next Image'
    });

    const chevronClasses = { root: classes.chevron, icon: classes.chevronIcon };

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
            isRtl ? showPrevImage() : showNextImage();
        },
        onSwipedRight: () => {
            isRtl ? showNextImage() : showPrevImage();
        },
        preventDefaultTouchmoveEvent: true,
        trackMouse: true
    });

    return (
        <div {...swipeHandlers} className={classes.root}>
            <AmProductLabels mode="PRODUCT" />
            <div className={classes.carouselContainer}>
                <AriaButton
                    className={classes.previousButton + (disableHandlePreviousButton() ? classes.disabledButton : '')}
                    onPress={showPrevImage}
                    aria-label={previousButton}
                    type="button"
                >
                    <Icon classes={chevronClasses} src={ChevronLeftIcon} size={40} />
                </AriaButton>

                <TransitionGroup component={null}>{image}</TransitionGroup>

                <AriaButton
                    className={classes.nextButton + (disableHandleNextButton() ? classes.disabledButton : '')}
                    onPress={showNextImage}
                    aria-label={nextButton}
                    type="button"
                >
                    <Icon classes={chevronClasses} src={ChevronRightIcon} size={60} />
                </AriaButton>
            </div>
            <Icon
                classes={{ root: classes.authorizedRetailer, icon: classes.authorizedRetailerIcon }}
                src={AuthorizedRetailer}
                size={60}
            />
            <div className={classes.thumbnailList}>{thumbnails}</div>
        </div>
    );
};

/**
 * Props for {@link ProductImageCarousel}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the
 * ProductImageCarousel component
 * @property {string} classes.currentImage classes for visible image
 * @property {string} classes.imageContainer classes for image container
 * @property {string} classes.nextButton classes for next button
 * @property {string} classes.previousButton classes for previous button
 * @property {string} classes.root classes for root container
 * @property {Object[]} images Product images input for Carousel
 * @property {bool} images[].disabled Is image disabled
 * @property {string} images[].file filePath of image
 * @property {string} images[].uid the id of the image
 * @property {string} images[].label label for image
 * @property {string} images[].position Position of image in Carousel
 */
ProductImageCarousel.propTypes = {
    classes: shape({
        carouselContainer: string,
        currentImage: string,
        currentImage_placeholder: string,
        imageContainer: string,
        nextButton: string,
        previousButton: string,
        root: string
    }),
    images: arrayOf(
        shape({
            label: string,
            position: number,
            disabled: bool,
            file: string.isRequired,
            uid: string.isRequired
        })
    ).isRequired
};

export default ProductImageCarousel;
