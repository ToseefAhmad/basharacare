import { useQuery } from '@apollo/client';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import useFieldState from '@magento/peregrine/lib/hooks/hook-wrappers/useInformedFieldStateWrapper';
import DEFAULT_OPERATIONS from '@magento/peregrine/lib/talons/CheckoutPage/PaymentInformation/paymentMethods.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const PAYMENT_ICONS = {
    tamara_pay_by_instalments: '/pwa/static-files/icons/tamara.svg',
    tabby_installments: '/pwa/static-files/icons/tabby.svg',
    tabby_cc_installments: '/pwa/static-files/icons/tabby.svg',
    tabby_checkout: '/pwa/static-files/icons/tabby.svg'
};

export const usePaymentMethods = props => {
    const operations = mergeOperations(DEFAULT_OPERATIONS, props.operations);
    const { getPaymentMethodsQuery } = operations;

    const [{ cartId }] = useCartContext();

    const { data, loading } = useQuery(getPaymentMethodsQuery, {
        skip: !cartId,
        variables: { cartId }
    });

    const { value: currentSelectedPaymentMethod } = useFieldState('selectedPaymentMethod');

    let availablePaymentMethods = (data && data.cart.available_payment_methods) || [];

    const initialSelectedMethod = (availablePaymentMethods.length && availablePaymentMethods[0].code) || null;

    availablePaymentMethods = availablePaymentMethods.map(method => {
        if (PAYMENT_ICONS[method.code]) {
            return {
                ...method,
                icon: PAYMENT_ICONS[method.code]
            };
        }
        return method;
    });

    return {
        availablePaymentMethods,
        currentSelectedPaymentMethod,
        initialSelectedMethod,
        isLoading: loading
    };
};
