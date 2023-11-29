import React from 'react';

import SimpleImage from '@app/components/overrides/Image/simpleImage';
import defaultClasses from '@app/components/PersonalizedRoutine/Tips/tips.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

const Tips = ({ title, imgPath, imgAlt, message, direction, rtl, classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);

    const rootClass = rtl ? classes.rootRtl : classes.root;
    const descriptionClass = direction ? classes.descriptionRtl : classes.description;
    const imgClass = direction ? classes.imageWrapRtl : classes.imageWrap;

    const imageElement = (
        <div className={imgClass}>
            <SimpleImage className={classes.image} src={imgPath} alt={imgAlt} />
        </div>
    );

    return (
        <div className={rootClass}>
            {direction ? imageElement : null}
            <div className={descriptionClass}>
                <h3 className={classes.title}>{title}</h3>
                <RichContent html={message} />
            </div>
            {!direction ? imageElement : null}
        </div>
    );
};

Tips.defaultProps = {
    title: 'Tips default',
    imgPath: '/static-files/night-routine.jpg',
    imgAlt: 'Night routine',
    message: '',
    direction: false,
    rtl: false
};

export default Tips;
