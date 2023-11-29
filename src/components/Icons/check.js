import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Check = forwardRef(({ color = 'currentColor', size = 8, ...rest }, ref) => (
    <svg ref={ref} width={size} height={size} viewBox="0 0 10 8" {...rest}>
        <path d="M8.43 1 3.566 5.864 1.65 3.948l-.65.65 2.566 2.566L9.08 1.65 8.43 1Z" fill={color} />
    </svg>
));

Check.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Check.displayName = 'Check';

export default Check;
