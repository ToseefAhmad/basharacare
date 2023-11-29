import React, { forwardRef } from 'react';

const Star = forwardRef(({ width, height, ...rest }, ref) => (
    <svg
        ref={ref}
        width={width || 26}
        height={height || 24}
        viewBox="0 0 26 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M25.1272 9.16672L16.068 8.57113L12.6563 0L9.24458 8.57113L0.195312 9.16672L7.13603 15.0601L4.85846 24L12.6563 19.071L20.4542 24L18.1766 15.0601L25.1272 9.16672Z"
            fill="currentColor"
            {...rest}
        />
    </svg>
));

Star.displayName = 'Star';

export default Star;
