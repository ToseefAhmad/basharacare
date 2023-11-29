import { gql } from '@apollo/client';

import { PriceSummaryFragment } from '@magento/peregrine/lib/talons/CartPage/PriceSummary/priceSummaryFragments.gql.js';
import { ShippingInformationFragment } from '@magento/peregrine/lib/talons/CheckoutPage/ShippingInformation/shippingInformationFragments.gql.js';

import {
    AvailableShippingMethodsCheckoutFragment,
    SelectedShippingMethodCheckoutFragment
} from './shippingMethodFragments.gql';

export const GET_SELECTED_AND_AVAILABLE_SHIPPING_METHODS = gql`
    query getSelectedAndAvailableShippingMethods($cartId: String!) {
        cart(cart_id: $cartId) {
            id
            ...AvailableShippingMethodsCheckoutFragment
            ...SelectedShippingMethodCheckoutFragment
            # We include the following fragments to avoid extra requeries
            # after this mutation completes. This all comes down to not
            # having ids for shipping address objects. With ids we could
            # merge results.
            ...ShippingInformationFragment
        }
    }
    ${AvailableShippingMethodsCheckoutFragment}
    ${SelectedShippingMethodCheckoutFragment}
    ${ShippingInformationFragment}
`;

export const SET_SHIPPING_METHOD = gql`
    mutation SetShippingMethod($cartId: String!, $shippingMethod: ShippingMethodInput!) {
        setShippingMethodsOnCart(input: { cart_id: $cartId, shipping_methods: [$shippingMethod] }) {
            cart {
                id
                # If this mutation causes "free" to become available we need to know.
                available_payment_methods {
                    code
                    title
                }
                ...SelectedShippingMethodCheckoutFragment
                ...PriceSummaryFragment
                # We include the following fragments to avoid extra requeries
                # after this mutation completes. This all comes down to not
                # having ids for shipping address objects. With ids we could
                # merge results.
                ...ShippingInformationFragment
                ...AvailableShippingMethodsCheckoutFragment
            }
        }
    }
    ${AvailableShippingMethodsCheckoutFragment}
    ${SelectedShippingMethodCheckoutFragment}
    ${PriceSummaryFragment}
    ${ShippingInformationFragment}
`;

export const GET_DELIVERY_INPUT_OPTIONS = gql`
    query getCartDeliveryDate($cartId: String!) {
        getCartDeliveryDate(cartId: $cartId) {
            is_enabled
            delivery_day {
                input_type
                default_value_was_set
                required_entry
                label_visible
                label
            }

            delivery_time {
                input_type
                required_entry
                label_visible
                label
            }
            delivery_comment {
                is_enabled
                label
            }
            available_limits {
                method
                entity_id
                name
                future_days_limit
                start_days_limit
                cut_off_time
                blacklist_cities
                error_message
                day_limits {
                    date
                    date_formatted
                    time_limits {
                        from
                        to
                        extra_charge
                        cut_off_time
                    }
                }
            }
        }
    }
`;

export const APPLY_DELIVERY_DATE = gql`
    mutation applyDeliveryDate($input: ApplyDeliveryDateInput) {
        applyDeliveryDate(input: $input) {
            status
        }
    }
`;

export default {
    setShippingMethodMutation: SET_SHIPPING_METHOD,
    getSelectedAndAvailableShippingMethodsQuery: GET_SELECTED_AND_AVAILABLE_SHIPPING_METHODS,
    getDeliveryInputOptions: GET_DELIVERY_INPUT_OPTIONS,
    setDeliveryDate: APPLY_DELIVERY_DATE
};
