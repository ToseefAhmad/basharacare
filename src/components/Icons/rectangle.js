import React, { forwardRef } from 'react';

const Rectangle = forwardRef(({ ...rest }, ref) => (
    <svg width="33" ref={ref} height="33" viewBox="0 0 33 33" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="16.2637" width="23" height="23" transform="rotate(45 16.2637 0)" fill="#EFEFEE" {...rest} />
    </svg>
));

Rectangle.displayName = 'Rectangle';

export default Rectangle;
