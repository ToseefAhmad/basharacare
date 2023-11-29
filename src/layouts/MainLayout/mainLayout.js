import { node, oneOf } from 'prop-types';
import React from 'react';

import Main from '@app/components/overrides/Main';
import useCartRestore from '@app/hooks/useCartRestore';
import useDirection from '@app/hooks/useDirection';

import { useMainLayout } from './useMainLayout';

const MainLayout = ({ direction, children }) => {
    const { hasOverlay } = useMainLayout();

    useDirection(direction);
    useCartRestore();

    return <Main isMasked={hasOverlay}>{children}</Main>;
};

MainLayout.propTypes = {
    direction: oneOf(['ltr', 'rtl', 'default']),
    children: node
};

export default MainLayout;
