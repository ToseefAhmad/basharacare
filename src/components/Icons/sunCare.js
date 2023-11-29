import React, { forwardRef } from 'react';

const SunCare = forwardRef(({ ...rest }, ref) => (
    <svg ref={ref} width="38" height="38" viewBox="0 0 38 38" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M26.511 28.6249C31.6482 24.286 32.3044 16.5935 27.9765 11.4432C23.6487 6.29284 15.9757 5.63503 10.8384 9.97387C5.70116 14.3127 5.04501 22.0052 9.37283 27.1556C13.7007 32.3059 21.3737 32.9637 26.511 28.6249Z"
            fill="currentColor"
            {...rest}
        />
        <path d="M23.7223 4.12161L16.0586 3.56544L20.1659 0L23.7223 4.12161Z" fill="currentColor" {...rest} />
        <path d="M12.7978 4.48186L6.57031 8.99584L7.43282 3.61719L12.7978 4.48186Z" fill="currentColor" {...rest} />
        <path d="M4.66588 11.7969L2.78889 19.2668L0 14.5929L4.66588 11.7969Z" fill="currentColor" {...rest} />
        <path d="M3.11805 22.6406L6.47309 29.5735L1.33984 27.7869L3.11805 22.6406Z" fill="currentColor" {...rest} />
        <path d="M8.88672 31.9375L15.9007 35.0877L10.8245 37.0267L8.88672 31.9375Z" fill="currentColor" {...rest} />
        <path d="M19.2695 35.3448L26.6635 33.2383L24.019 38L19.2695 35.3448Z" fill="currentColor" {...rest} />
        <path d="M29.4141 31.2672L33.7266 24.8867L34.7525 30.2387L29.4141 31.2672Z" fill="currentColor" {...rest} />
        <path d="M34.5678 21.6017L33.7812 13.9375L37.9988 17.3772L34.5678 21.6017Z" fill="currentColor" {...rest} />
        <path d="M32.3179 10.8847L26.8047 5.5213L32.2381 5.4375L32.3179 10.8847Z" fill="currentColor" {...rest} />
    </svg>
));

SunCare.displayName = 'SunCare';

export default SunCare;
