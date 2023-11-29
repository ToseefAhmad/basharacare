import React, { forwardRef } from 'react';

const Close = forwardRef(({ ...rest }, ref) => (
    <svg ref={ref} width="50" height="49" viewBox="0 0 50 49" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M33.6536 17.9673L32.0203 16.334L25.487 22.8673L18.9536 16.334L17.3203 17.9673L23.8536 24.5007L17.3203 31.034L18.9536 32.6673L25.487 26.134L32.0203 32.6673L33.6536 31.034L27.1203 24.5007L33.6536 17.9673Z"
            fill="black"
            {...rest}
        />
        <circle cx="25.4844" cy="24.5" r="23.75" stroke="white" strokeWidth="1.5" {...rest} />
    </svg>
));

Close.displayName = 'Close';

export default Close;
