import { node, oneOf } from 'prop-types';
import React from 'react';

import useCartRestore from '@app/hooks/useCartRestore';
import useDirection from '@app/hooks/useDirection';

const EmptyLayout = ({ direction, children }) => {
    useDirection(direction);
    useCartRestore();

    return <>{children}</>;
};

EmptyLayout.propTypes = {
    direction: oneOf(['ltr', 'rtl', 'default']),
    children: node
};

export default EmptyLayout;
