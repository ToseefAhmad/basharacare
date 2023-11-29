import React, { forwardRef } from 'react';

const Resize = forwardRef(({ className, ...rest }, ref) => (
    <svg
        ref={ref}
        width="14"
        height="13"
        viewBox="0 0 14 13"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
    >
        <g opacity="0.2">
            <line x1="0.599572" y1="12.6464" x2="12.1551" y2="1.09089" stroke="black" {...rest} />
            <line x1="7.81832" y1="12.6464" x2="13.5961" y2="6.86867" stroke="black" {...rest} />
        </g>
    </svg>
));

Resize.displayName = 'Box';

export default Resize;
