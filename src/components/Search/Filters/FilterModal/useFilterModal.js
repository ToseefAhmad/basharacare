import { useCallback } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';

const DRAWER_NAME = 'search-filter';

export const useFilterModal = () => {
    const [{ drawer }, { toggleDrawer, closeDrawer }] = useAppContext();
    const isOpen = drawer === DRAWER_NAME;

    const handleOpen = useCallback(() => {
        toggleDrawer(DRAWER_NAME);
    }, [toggleDrawer]);

    const handleClose = useCallback(() => {
        closeDrawer();
    }, [closeDrawer]);

    return {
        isOpen,
        handleOpen,
        handleClose
    };
};
