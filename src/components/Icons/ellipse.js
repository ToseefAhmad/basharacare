import PropTypes from 'prop-types';
import React, { forwardRef } from 'react';

const Ellipse = forwardRef(({ color = 'currentColor', size = 8, ...rest }, ref) => (
    <svg ref={ref} width={size} height={size} {...rest}>
        <circle cx={size / 2} cy={size / 2} r={size / 2.3} fill={color} />
    </svg>
));

Ellipse.propTypes = {
    color: PropTypes.string,
    size: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
};

Ellipse.displayName = 'Ellipse';

export default Ellipse;
