import React, { forwardRef } from 'react';

const Hamburger = forwardRef(({ ...rest }, ref) => (
    <svg ref={ref} width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 9H13.5V7.5H0V9ZM0 5.25H13.5V3.75H0V5.25ZM0 0V1.5H13.5V0H0Z" fill="currentColor" {...rest} />
    </svg>
));

Hamburger.displayName = 'Hamburger';

export default Hamburger;
