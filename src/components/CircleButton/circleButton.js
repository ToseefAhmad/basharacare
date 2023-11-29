import { shape, string } from 'prop-types';
import React from 'react';

import Button from '@app/components/overrides/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './circleButton.module.css';

const CircleButton = ({ children, classes: propClasses, ...props }) => {
    const classes = useStyle(defaultClasses, propClasses);

    return (
        <Button
            classes={{
                root_normalPriority: classes.root
            }}
            priority="normal"
            {...props}
        >
            {children}
        </Button>
    );
};

CircleButton.propTypes = {
    classes: shape({
        root: string
    })
};

export default CircleButton;
