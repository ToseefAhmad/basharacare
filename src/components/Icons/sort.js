import React, { forwardRef } from 'react';

const Sort = forwardRef(({ ...rest }, ref) => (
    <svg ref={ref} width="14" height="10" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M5.25 9H8.25V7.5H5.25V9ZM0 0V1.5H13.5V0H0ZM2.25 5.25H11.25V3.75H2.25V5.25Z"
            fill="currentColor"
            {...rest}
        />
    </svg>
));

Sort.displayName = 'Sort';

export default Sort;
