import React, { forwardRef } from 'react';

import classes from './icons.module.css';

const Arrow = forwardRef(({ ...rest }, ref) => (
    <svg
        className={classes.invert}
        ref={ref}
        width="41"
        height="12"
        viewBox="0 0 41 12"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <line x1="40" y1="5.33594" y2="5.33594" stroke="black" {...rest} />
        <path d="M35 0.363281L40 5.62448L35 10.8857" stroke="black" {...rest} />
    </svg>
));

Arrow.displayName = 'Arrow';

export default Arrow;
