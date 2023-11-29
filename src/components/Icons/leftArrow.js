import React, { forwardRef } from 'react';

const LeftArrow = forwardRef(({ color = 'currentColor', width = 54, height = 12, ...rest }, ref) => (
    <svg ref={ref} width={width} height={height} fill={color} {...rest}>
        <path d="M1 6.027h53M6 11 1 5.739 6 .478" stroke="#000" />
    </svg>
));

LeftArrow.displayName = 'LeftArrow';

export default LeftArrow;
