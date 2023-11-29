import { useQuery } from '@apollo/client';
import { useCallback, useEffect, useMemo, useState } from 'react';

import { useAppContext } from '@magento/peregrine/lib/context/app';
import { useCatalogContext } from '@magento/peregrine/lib/context/catalog';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/Navigation/navigation.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const ancestors = {
    CREATE_ACCOUNT: 'SIGN_IN',
    FORGOT_PASSWORD: 'SIGN_IN',
    MY_ACCOUNT: 'MENU',
    SIGN_IN: 'MENU',
    MENU: null
};

export const useNavigation = (props = {}) => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getRootCategoryId } = operations;
    // Retrieve app state from context
    const [appState, { closeDrawer }] = useAppContext();

    const navigationOen = appState.drawer === 'nav';

    useEffect(() => {
        if (navigationOen) {
            document.body.classList.add('mobile-nav-open');
        }
        return () => {
            document.body.classList.remove('mobile-nav-open');
        };
    }, [navigationOen]);

    const [catalogState, { actions: catalogActions }] = useCatalogContext();

    const { data: getRootCategoryData } = useQuery(getRootCategoryId, {
        fetchPolicy: 'cache-only'
    });

    const rootCategoryId = useMemo(() => {
        if (getRootCategoryData) {
            return getRootCategoryData.storeConfig.root_category_uid;
        }
    }, [getRootCategoryData]);

    // Extract relevant data from app state
    const { drawer } = appState;
    const isOpen = drawer === 'nav';
    const { categories } = catalogState;

    // Get local state
    const [view, setView] = useState('MENU');
    const [categoryId, setCategoryId] = useState(rootCategoryId);

    useEffect(() => {
        // On a fresh render with cold cache set the current category as root
        // Once the root category query completes.
        if (rootCategoryId && !categoryId) {
            setCategoryId(rootCategoryId);
        }
    }, [categoryId, rootCategoryId]);

    // Define local variables
    const category = categories[categoryId];
    const isTopLevel = categoryId === rootCategoryId;
    const hasModal = view !== 'MENU';

    // Define handlers
    const handleBack = useCallback(() => {
        const parent = ancestors[view];

        if (parent) {
            setView(parent);
        } else if (category && !isTopLevel) {
            setCategoryId(category.parentId);
        } else {
            closeDrawer();
        }
    }, [category, closeDrawer, isTopLevel, view]);

    const handleClose = useCallback(() => {
        closeDrawer();
        // Sets next root component to show proper loading effect
    }, [closeDrawer]);

    // Create callbacks for local state
    const showCreateAccount = useCallback(() => {
        setView('CREATE_ACCOUNT');
    }, [setView]);
    const showForgotPassword = useCallback(() => {
        setView('FORGOT_PASSWORD');
    }, [setView]);
    const showMainMenu = useCallback(() => {
        setView('MENU');
    }, [setView]);
    const showMyAccount = useCallback(() => {
        setView('MY_ACCOUNT');
    }, [setView]);
    const showSignIn = useCallback(() => {
        setView('SIGN_IN');
    }, [setView]);

    return {
        catalogActions,
        categoryId,
        handleBack,
        handleClose,
        hasModal,
        isOpen,
        isTopLevel,
        setCategoryId,
        showCreateAccount,
        showForgotPassword,
        showMainMenu,
        showMyAccount,
        showSignIn,
        view
    };
};
