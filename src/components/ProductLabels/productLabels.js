/* eslint-disable react-hooks/rules-of-hooks */
import PropTypes from 'prop-types';
import React, { useCallback, useRef, useState, useEffect } from 'react';

import { useEventListener } from '@magento/peregrine';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import { useAmProductLabelContext } from './context';
import Label from './Label';
import defaultClasses from './productLabels.module.css';
import { toCamelCase } from './utils';

/**
 * @typedef ProductLabels
 * @kind functional component
 *
 * @param {props} props React component props
 *
 * @returns {React.Element}
 */

const LABEL_ALIGNMENT = {
    0: 'vertical',
    1: 'horizontal'
};

const LabelGroup = ({ items, dimensions, marginBetween, labelsAlignment, mode }) =>
    items.map((label, index) => {
        const settingStyle = {
            [`margin${labelsAlignment === 1 ? 'Left' : 'Top'}`]: index !== 0 ? marginBetween : 0
        };
        return <Label item={label} key={index} dimensions={dimensions} settingStyle={settingStyle} mode={mode} />;
    });

const ProductLabels = props => {
    const { itemId, productWidth, mode: labelMode } = props;
    const classes = mergeClasses(defaultClasses, props.classes);

    const targetRef = useRef();
    const { labels, mode, labelSetting, loading } = useAmProductLabelContext() || {};
    const [dimensions, setDimensions] = useState({
        width: productWidth
    });

    const setLabelDynamicStyles = useCallback(() => {
        const rootContainer = targetRef.current;

        if (rootContainer) {
            setDimensions({
                width: rootContainer.offsetWidth
            });
        }
    }, [setDimensions]);

    useEventListener(window, 'resize', setLabelDynamicStyles);

    useEffect(() => {
        setLabelDynamicStyles();
    }, [targetRef?.current?.offsetWidth, setLabelDynamicStyles]);

    useEffect(setLabelDynamicStyles, [setLabelDynamicStyles]);

    if (!labels) {
        return null;
    }

    const { items } = mode === 'PRODUCT' ? labels : labels[itemId] || {};

    if (!items || !items.length) {
        return null;
    }

    const groupedLabels = items.reduce((acc, curr) => {
        if (!acc[curr.position]) {
            acc[curr.position] = [];
        }
        acc[curr.position].push(curr);

        return acc;
    }, {});

    const labelsContent = Object.keys(groupedLabels).map(group => {
        const { labels_alignment: labelsAlignment, margin_between: marginBetween } = labelSetting || {};
        const alignClass = LABEL_ALIGNMENT[labelsAlignment] || LABEL_ALIGNMENT[0];
        const groupClasses = `${classes.groupRoot} ${classes[toCamelCase(group)]} ${classes[alignClass]}`;

        return (
            <div className={groupClasses} key={group}>
                <LabelGroup
                    items={groupedLabels[group]}
                    dimensions={dimensions}
                    marginBetween={marginBetween}
                    labelsAlignment={labelsAlignment}
                    mode={labelMode}
                />
            </div>
        );
    });

    return (
        <div className={labelMode === 'CATEGORY' ? classes.rootCat : classes.root} ref={targetRef}>
            {!loading && labelsContent}
        </div>
    );
};

/**
 * Props for {@link ProductLabels}
 *
 * @typedef props
 *
 * @property {Object} classes An object containing the class names for the AmProductLabels component.
 */
ProductLabels.propTypes = {
    classes: PropTypes.shape({
        root: PropTypes.string
    }),
    itemId: PropTypes.number,
    mode: PropTypes.string,
    productWidth: PropTypes.number
};

ProductLabels.defaultProps = {
    productWidth: 593
};

export default ProductLabels;
