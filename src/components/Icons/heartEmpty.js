import React, { forwardRef } from 'react';

const HeartEmpty = forwardRef(({ ...rest }, ref) => (
    <svg ref={ref} width="18" height="15" viewBox="0 0 18 15" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M9.00165 14.4013C8.99912 14.4028 8.99655 14.4044 8.99395 14.406C8.97597 14.3918 8.95984 14.379 8.94662 14.3681L8.94564 14.3673C8.16555 13.7296 7.41648 13.1311 6.75779 12.6052C4.80532 11.0461 3.23341 9.78867 2.14211 8.55492C1.06314 7.33512 0.5 6.1884 0.5 4.85743C0.5 2.35757 2.33924 0.5 4.7808 0.5C5.65284 0.5 6.4448 0.75672 7.14967 1.26647C7.83071 1.76013 8.29243 2.3959 8.56847 2.86758L9 3.60496L9.43153 2.86758C9.70754 2.39594 10.1692 1.76026 10.8501 1.26662C11.555 0.756771 12.3471 0.5 13.2192 0.5C15.6608 0.5 17.5 2.35757 17.5 4.85743C17.5 6.18928 16.9368 7.33599 15.8579 8.55553C14.7666 9.78907 13.1947 11.046 11.2422 12.6052C10.5835 13.1311 9.83445 13.7296 9.05435 14.3673L9.05338 14.3681C9.05414 14.3675 9.05384 14.3677 9.05234 14.3687C9.04781 14.3719 9.03232 14.3826 9.00165 14.4013Z"
            stroke="black"
            {...rest}
        />
    </svg>
));

HeartEmpty.displayName = 'HeartEmpty';

export default HeartEmpty;