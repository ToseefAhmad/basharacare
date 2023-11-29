import React, { forwardRef } from 'react';

const Cart = forwardRef(({ ...rest }, ref) => (
    <svg ref={ref} width="17" height="18" viewBox="0 0 17 18" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path
            d="M5.1 14.2755C4.165 14.2755 3.4 15.042 3.4 15.9789C3.4 16.9157 4.165 17.6823 5.1 17.6823C6.035 17.6823 6.8 16.9157 6.8 15.9789C6.8 15.042 6.035 14.2755 5.1 14.2755ZM0 0.648438V2.35182H1.7L4.76 8.82468L3.57 10.8687C3.485 11.1242 3.4 11.4649 3.4 11.7204C3.4 12.6573 4.165 13.4238 5.1 13.4238H15.3V11.7204H5.44C5.355 11.7204 5.27 11.6353 5.27 11.5501V11.4649L6.035 10.017H12.325C13.005 10.017 13.515 9.67633 13.77 9.16532L16.83 3.62936C17 3.45902 17 3.37385 17 3.20351C17 2.6925 16.66 2.35182 16.15 2.35182H3.57L2.805 0.648438H0ZM13.6 14.2755C12.665 14.2755 11.9 15.042 11.9 15.9789C11.9 16.9157 12.665 17.6823 13.6 17.6823C14.535 17.6823 15.3 16.9157 15.3 15.9789C15.3 15.042 14.535 14.2755 13.6 14.2755Z"
            fill="currentColor"
            {...rest}
        />
    </svg>
));

Cart.displayName = 'Cart';

export default Cart;
