import React, { forwardRef } from 'react';

const ListStar = forwardRef(({ ...rest }, ref) => (
    <svg ref={ref} width="11" height="13" viewBox="0 0 11 13" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M8.64609 5.86364C7.54358 5.45323 6.67864 4.50841 6.30242 3.30689L5.49887 0.740234L4.69527 3.30689C4.31906 4.50966 3.45298 5.45323 2.35161 5.86364L0 6.74029L2.35274 7.6168C3.45525 8.02727 4.32019 8.97213 4.69641 10.1736L5.5 12.7402L6.30356 10.1736C6.67978 8.97104 7.54588 8.02727 8.64722 7.6168L11 6.74029L8.64609 5.86364Z"
            fill="currentColor"
            {...rest}
        />
    </svg>
));

ListStar.displayName = 'ListStar';

export default ListStar;
