import { useMutation } from '@apollo/client';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import { ADD_ALL_WISHLIST } from '@app/components/overrides/WishlistPage/wishlist.gql';
import { useCartContext } from '@magento/peregrine/lib/context/cart';

/**
 * @function
 *
 * @returns {{}}
 */
export const useShared = ({ sharingCode }) => {
    const [{ cartId }] = useCartContext();
    const { push } = useHistory();

    const [addAllProductToCart] = useMutation(ADD_ALL_WISHLIST, {
        fetchPolicy: 'no-cache'
    });

    useEffect(() => {
        if (sharingCode) {
            addAllProductToCart({
                variables: {
                    sharingCode,
                    cartId
                }
            });
            push('/cart');
        }
    }, [addAllProductToCart, cartId, push, sharingCode]);

    return {};
};
