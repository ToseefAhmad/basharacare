import PropTypes, { shape, string } from 'prop-types';
import React, { useMemo } from 'react';

import { toCamelCase } from '../utils';

import resourceUrl from '@magento/peregrine/lib/util/makeUrl';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import defaultClasses from './label.module.css';

/**
 * Cut html tags from string
 *
 * @return {String}.
 */
const stripText = value => {
    return value.replace(/(<([^>]+)>)/gi, '');
};

/**
 * @typedef Label
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element}
 */
const Label = props => {
    const { item, dimensions, settingStyle, mode } = props;
    const classes = mergeClasses(defaultClasses, props.classes);
    const minSize = mode === 'PRODUCT' ? 208 : 73;
    const resolution = mode === 'PRODUCT' ? 3 : 2.5;

    const itemStyle = useMemo(() => {
        const css = item.style;
        const result = {};
        const rules = css.split(';');

        if (Array.isArray(rules) && rules.length) {
            rules.forEach(rule => {
                let [key, value] = rule.split(':');

                if (key && value) {
                    key = toCamelCase(key.trim());
                    value = value.trim();
                    result[key] = value;
                }
            });
        }

        return result;
    }, [item]);

    /**
     * Set Label width in percent of product image
     *
     * @return {Number}.
     */
    const scaledWidth = useMemo(() => {
        if (item.size) {
            return (dimensions.width / 100) * parseInt(item.size) > 60
                ? (dimensions.width / 100) * parseInt(item.size)
                : minSize;
        } else {
            const size = itemStyle.maxWidth
                ? dimensions.width - dimensions.width / parseInt(itemStyle.maxWidth)
                : dimensions.width / resolution;
            return size < 45 ? minSize : size;
        }
    }, [dimensions.width, item.size, itemStyle.maxWidth, minSize, resolution]);

    /**
     * Set responsive font-size and max-height for Label text
     *
     * @return {Object}.
     */
    const getTextStyles = () => {
        return {
            fontSize: (scaledWidth < 100 ? scaledWidth : 100) + '%',
            maxWidth: scaledWidth
        };
    };

    /**
     * Combine css styles: static from backend and dynamic width while resize
     *
     * @return {Object}.
     */
    const getLabelStyles = () => ({
        ...settingStyle,
        ...itemStyle,
        ...{ width: scaledWidth + 'px' }
    });

    const imgSrc = resourceUrl(`/${item.image.replace(/^\//, '')}`, {
        type: 'image-amasty',
        width: scaledWidth * 2,
        fit: 'contain'
    });

    /**
     * Render Label component
     *
     */
    return (
        <div style={getLabelStyles()} className={classes.root}>
            {item.image && (
                <Image
                    alt={stripText(item.txt)}
                    classes={{
                        image: classes.image,
                        root: classes.imageContainer
                    }}
                    displayPlaceholder={false}
                    src={imgSrc}
                    width={scaledWidth}
                />
            )}

            <div className={classes.text} style={getTextStyles()}>
                <RichContent html={item.txt} />
            </div>
        </div>
    );
};

/**
 * Props for {@link Label}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the AmLabel component.
 */
Label.propTypes = {
    classes: shape({
        root: string,
        image: string,
        imageContainer: string,
        text: string,
        topLeft: string,
        topCenter: string,
        topRight: string,
        middleLeft: string,
        middleCenter: string,
        middleRight: string,
        bottomLeft: string,
        bottomCenter: string,
        bottomRight: string
    }),
    item: PropTypes.object,
    dimensions: shape({
        width: PropTypes.number
    }),
    mode: string
};

export default Label;
