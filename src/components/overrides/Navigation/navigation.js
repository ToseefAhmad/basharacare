import { shape, string } from 'prop-types';
import React, { Suspense, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import StoreSwitcher from '../Header/storeSwitcher';

import AuthBar from '@app/components/overrides/AuthBar';
import CategoryTree from '@app/components/overrides/CategoryTree/categoryTree';
import { useStyle } from '@magento/venia-ui/lib/classify';
import CmsBlock from '@magento/venia-ui/lib/components/CmsBlock';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import NavHeader from './navHeader';
import defaultClasses from './navigation.module.css';
import { useNavigation } from './useNavigation';

const AuthModal = React.lazy(() => import('@magento/venia-ui/lib/components/AuthModal'));

const Navigation = props => {
    const {
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
    } = useNavigation();

    const history = useHistory();
    const [prevPath, setPrevPath] = useState(history.location.pathname);

    const classes = useStyle(defaultClasses, props.classes);
    const rootClassName = isOpen ? classes.root_open : classes.root;
    const modalClassName = hasModal ? classes.modal_open : classes.modal;
    const bodyClassName = hasModal ? classes.body_masked : classes.body;

    // Lazy load the auth modal because it may not be needed.
    const authModal = hasModal ? (
        <Suspense fallback={<LoadingIndicator />}>
            <AuthModal
                closeDrawer={handleClose}
                showCreateAccount={showCreateAccount}
                showForgotPassword={showForgotPassword}
                showMainMenu={showMainMenu}
                showMyAccount={showMyAccount}
                showSignIn={showSignIn}
                view={view}
                classes={{ root: classes.authModalRoot }}
            />
        </Suspense>
    ) : null;

    const currentUrl = history.location.pathname;

    useEffect(() => {
        if (prevPath !== currentUrl) {
            handleClose();
            setPrevPath(currentUrl);
        }
    }, [currentUrl, handleClose, history, prevPath]);

    return (
        <aside className={rootClassName}>
            <header className={classes.header}>
                <NavHeader isTopLevel={isTopLevel} onBack={handleBack} handleClose={handleClose} view={view} />
            </header>
            <div className={bodyClassName}>
                <CategoryTree
                    categoryId={categoryId}
                    onNavigate={handleClose}
                    setCategoryId={setCategoryId}
                    updateCategories={catalogActions.updateCategories}
                    isTopLevel={isTopLevel}
                />

                {isTopLevel && <CmsBlock classes={{ root: classes.cmsBlockRoot }} identifiers="mobile-nav" />}
            </div>
            <div className={classes.footer}>
                <AuthBar noChip disabled={hasModal} showMyAccount={showMyAccount} showSignIn={showSignIn} />
                <div className={classes.switchers}>
                    <StoreSwitcher />
                </div>
            </div>
            <div className={modalClassName}>{authModal}</div>
        </aside>
    );
};

export default Navigation;

Navigation.propTypes = {
    classes: shape({
        body: string,
        form_closed: string,
        form_open: string,
        footer: string,
        header: string,
        root: string,
        root_open: string,
        signIn_closed: string,
        signIn_open: string
    })
};
