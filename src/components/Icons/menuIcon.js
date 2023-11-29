import React, { forwardRef } from 'react';

const MenuIcon = forwardRef((rest, ref) => (
    <svg ref={ref} xmlns="http://www.w3.org/2000/svg" width="0.377778in" height="0.133333in" viewBox="0 0 34 12">
        <path
            id="Imported Path"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            d="M 33.66,10.30
           C 33.66,10.30 0.12,10.30 0.12,10.30M 33.66,1.24
           C 33.66,1.24 0.12,1.24 0.12,1.24"
            {...rest}
        />
    </svg>
));

MenuIcon.displayName = 'MenuIcon';

export default MenuIcon;
