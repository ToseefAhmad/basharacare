import React, { forwardRef } from 'react';

import classes from './icons.module.css';

const ChevronRight = forwardRef(({ ...rest }, ref) => (
    <svg
        ref={ref}
        className={classes.invert}
        width="7"
        height="10"
        viewBox="0 0 7 10"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M1.16675 10L0 8.83325L3.8336 4.99966L0 1.16606L1.16675 -0.000686646L6.16709 4.99966L1.16675 10Z"
            fill="currentColor"
            {...rest}
        />
    </svg>
));

ChevronRight.displayName = 'ChevronRight';

export default ChevronRight;
