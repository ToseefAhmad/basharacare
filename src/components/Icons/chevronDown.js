import React, { forwardRef } from 'react';

const ChevronDown = forwardRef(({ ...rest }, ref) => (
    <svg ref={ref} width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M15 1.75L13.25 -7.64949e-08L7.5 5.75L1.75 -5.79176e-07L-7.64949e-08 1.75L7.5 9.25L15 1.75Z"
            fill="currentColor"
            {...rest}
        />
    </svg>
));

ChevronDown.displayName = 'ChevronDown';

export default ChevronDown;
