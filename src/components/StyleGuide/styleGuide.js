import React from 'react';

import Buttons from './buttons';
import Forms from './forms';
import Icons from './icons';
import classes from './styleGuide.module.css';
import Typography from './typography';

const StyleGuide = () => (
    <div className={classes.root}>
        <Typography />
        <Buttons />
        <Forms />
        <Icons />
    </div>
);

export default StyleGuide;
