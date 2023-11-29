import React, { forwardRef } from 'react';

const RightArrow = forwardRef(({ ...rest }, ref) => (
    <svg width="51" ref={ref} height="14" viewBox="0 0 51 14" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <line x1="49.1631" y1="6.63867" x2="0.00107574" y2="6.63867" stroke="black" {...rest} />
        <path d="M43.0186 1L49.1638 7.14525L43.0186 13.2905" stroke="black" {...rest} />
    </svg>
));

RightArrow.displayName = 'RightArrow';

export default RightArrow;
