import React, { forwardRef } from 'react';

const Search = forwardRef(({ width, height, ...rest }, ref) => (
    <svg
        ref={ref}
        width={width || 18}
        height={height || 18}
        viewBox="0 0 18 18"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M12.3997 11.4404H11.6141L11.3195 11.1452C12.3015 10.0629 12.8907 8.58701 12.8907 7.01272C12.8907 3.47058 10.0429 0.617188 6.50783 0.617188C2.97273 0.617188 0.125 3.47058 0.125 7.01272C0.125 10.5549 2.97273 13.4083 6.50783 13.4083C8.07899 13.4083 9.55196 12.8179 10.6321 11.834L10.9267 12.1291V12.9163L15.8366 17.8359L17.3096 16.36L12.3997 11.4404ZM6.50783 11.4404C4.0529 11.4404 2.08895 9.47254 2.08895 7.01272C2.08895 4.5529 4.0529 2.58504 6.50783 2.58504C8.96277 2.58504 10.9267 4.5529 10.9267 7.01272C10.9267 9.47254 8.96277 11.4404 6.50783 11.4404Z"
            fill="currentColor"
            {...rest}
        />
    </svg>
));

Search.displayName = 'Search';

export default Search;