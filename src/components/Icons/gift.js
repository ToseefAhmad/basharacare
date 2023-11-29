import React, { forwardRef } from 'react';

const Gift = forwardRef(({ ...rest }, ref) => (
    <svg ref={ref} width="20" height="19" viewBox="0 0 20 19" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_2_39248)">
            <path
                d="M18.75 5.04824H14.7949C15.0785 4.85166 15.3223 4.65625 15.4926 4.48145C16.5 3.45291 16.5 1.7787 15.4926 0.750155C14.5137 -0.249458 12.8062 -0.250646 11.8262 0.750155C11.2848 1.30188 9.8461 3.54803 10.0449 5.04863H9.95508C10.1527 3.54803 8.71523 1.30188 8.17384 0.750155C7.19376 -0.250646 5.48633 -0.249458 4.50743 0.750155C3.5 1.7787 3.5 3.45291 4.50625 4.48145C4.67735 4.65665 4.9211 4.85166 5.20508 5.04824H1.25H0V6.31658C0 6.31658 0 5.96312 0 8.24725C0 8.49492 0 9.18681 0 9.18681H0.625H1.25V17.7317V19H2.5H17.5H18.75V17.7317V9.18681H19.375H20V7.41209V6.31658V5.04824H18.75ZM11.3227 5.00623C11.0328 4.70064 11.8703 2.50364 12.7125 1.64394C13.2199 1.12788 14.1 1.12907 14.6062 1.64394C15.1301 2.17903 15.1301 3.0518 14.6062 3.58689C14.0676 4.13743 12.4188 5.04784 11.5551 5.04784C11.3762 5.04824 11.3238 5.00742 11.3227 5.00623ZM5.39375 3.58689C4.86992 3.0518 4.86992 2.17903 5.39375 1.64394C5.64765 1.38512 5.98359 1.24322 6.34141 1.24322C6.69765 1.24322 7.03398 1.38512 7.28749 1.64394C8.13008 2.50403 8.96757 4.70064 8.67616 5.00623C8.67616 5.00623 8.62384 5.04824 8.44492 5.04824C7.58125 5.04824 5.93243 4.13743 5.39375 3.58689Z"
                fill="currentColor"
                {...rest}
            />
        </g>
        <defs>
            <clipPath id="clip0_2_39248">
                <rect width="20" height="19" fill="currentColor" />
            </clipPath>
        </defs>
    </svg>
));

Gift.displayName = 'Gift';

export default Gift;