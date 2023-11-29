import React, { forwardRef } from 'react';

import classes from './icons.module.css';

const ArrowShort = forwardRef(({ ...rest }, ref) => (
    <svg
        ref={ref}
        className={classes.invert}
        width="21"
        height="13"
        viewBox="0 0 21 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <line x1="19.7734" y1="6.50781" x2="0.990234" y2="6.50781" stroke="currentColor" strokeWidth="1.5" {...rest} />
        <path d="M14.0625 1L19.7757 6.71322L14.0625 12.4264" stroke="currentColor" strokeWidth="1.5" {...rest} />
    </svg>
));

ArrowShort.displayName = 'ArrowShort';

export default ArrowShort;
