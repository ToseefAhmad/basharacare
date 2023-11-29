import { createActions } from '@app/util/action';

export const initialState = {
    apsFormData: {},
    email: undefined,
    shippingAddress: undefined
};

export const CheckoutActions = {
    setApsFormData: 'CHECKOUT/SET_APS_FORM_DATA',
    setShippingAddress: 'CHECKOUT/SET_SHIPPING_ADDRESS'
};

export const createCheckoutDispatchers = dispatch => createActions(CheckoutActions, dispatch);

export const initialCheckoutDispatchers = () => {
    return;
};

export const checkoutReducer = (state, action) => {
    switch (action.type) {
        case CheckoutActions.setApsFormData:
            return {
                ...state,
                apsFormData: action.payload
            };
        case CheckoutActions.setShippingAddress:
            return {
                ...state,
                email: action.payload.email,
                shippingAddress: action.payload.address
            };
    }
};
