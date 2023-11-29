import React, { forwardRef } from 'react';

const ChevronUp = forwardRef(({ ...rest }, ref) => (
    <svg ref={ref} width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
        <svg width="15" height="10" viewBox="0 0 15 10" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M15 7.5L13.25 9.25L7.5 3.5L1.75 9.25L-7.64949e-08 7.5L7.5 3.27835e-07L15 7.5Z"
                fill="currentColor"
                {...rest}
            />
        </svg>
    </svg>
));

ChevronUp.displayName = 'ChevronUp';

export default ChevronUp;
