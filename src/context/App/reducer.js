import { createActions } from '@app/util/action';

export const initialState = {
    isRestoringCart: false,
    isSearchOpen: false,
    isPageFullWidth: false,
    isSigningIn: false
};

export const AppActions = {
    setIsRestoringCart: 'APP/SET_IS_RESTORING_CART',
    setIsSearchOpen: 'APP/SET_IS_SEARCH_OPEN',
    setIsPageFullWidth: 'APP/SET_IS_PAGE_FULL_WIDTH',
    setIsSigningIn: 'APP/SET_IS_SIGNING_IN'
};

export const createAppDispatchers = dispatch => createActions(AppActions, dispatch);

export const initialAppDispatchers = () => {
    return;
};

export const appReducer = (state, action) => {
    switch (action.type) {
        case AppActions.setIsRestoringCart:
            return {
                ...state,
                isRestoringCart: action.payload
            };
        case AppActions.setIsSearchOpen:
            return {
                ...state,
                isSearchOpen: action.payload,
                isPageFullWidth: action.payload
            };
        case AppActions.setIsPageFullWidth:
            return {
                ...state,
                isPageFullWidth: action.payload
            };
        case AppActions.setIsSigningIn:
            return {
                ...state,
                isSigningIn: action.payload
            };
    }
};
