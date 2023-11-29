import React from 'react';
import { RotateCw as LoaderIcon } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './spinner.module.css';

const Spinner = props => {
    const classes = useStyle(defaultClasses, props.classes);

    return (
        <div className={classes.root}>
            <Icon src={LoaderIcon} size={24} classes={{ root: classes.indicator }} />
        </div>
    );
};

export default Spinner;
