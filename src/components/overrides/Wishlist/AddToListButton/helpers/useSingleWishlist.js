import { useMutation, useQuery } from '@apollo/client';
import { useCallback, useMemo, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';

import { GET_CUSTOMER } from '@app/components/overrides/CreateAccount/createAccount.gql.js';
import { useTracking } from '@app/hooks/useTracking';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useAwaitQuery } from '@magento/peregrine/lib/hooks/useAwaitQuery';
import { getUserDetails } from '@magento/peregrine/lib/store/actions/user';
import defaultOperations from '@magento/peregrine/lib/talons/Wishlist/AddToListButton/addToListButton.gql';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

export const useSingleWishlist = props => {
    const { afterAdd, beforeAdd, item } = props;
    const { trackAddToWishlist } = useTracking();

    const operations = mergeOperations(defaultOperations, props.operations);
    const fetchUserDetails = useAwaitQuery(GET_CUSTOMER);

    const [
        addProductToWishlist,
        { data: addProductData, error: errorAddingProduct, loading: isAddingToWishlist }
    ] = useMutation(operations.addProductToWishlistMutation);

    const {
        client,
        data: { customerWishlistProducts }
    } = useQuery(operations.getProductsInWishlistsQuery);

    const isSelected = useMemo(() => {
        return customerWishlistProducts.includes(item.sku) || isAddingToWishlist;
    }, [customerWishlistProducts, isAddingToWishlist, item.sku]);

    const [showLoginToast, setShowLoginToast] = useState(0);

    const { formatMessage } = useIntl();
    const [{ isSignedIn }] = useUserContext();

    const history = useHistory();

    const handleClick = useCallback(async () => {
        if (!isSignedIn) {
            setShowLoginToast(current => ++current);
            return;
        }

        if (isSelected) {
            history.push('/wishlist');
            return;
        }

        if (!isSelected) {
            try {
                if (beforeAdd) {
                    await beforeAdd();
                }

                await addProductToWishlist({
                    variables: { wishlistId: '0', itemOptions: item }
                });
                await getUserDetails(fetchUserDetails);

                trackAddToWishlist({
                    products: [item]
                });

                client.writeQuery({
                    query: operations.getProductsInWishlistsQuery,
                    data: {
                        customerWishlistProducts: [...customerWishlistProducts, item.sku]
                    }
                });

                if (afterAdd) {
                    afterAdd();
                }
            } catch (error) {
                console.error(error);
            }
            return;
        }
    }, [
        isSignedIn,
        isSelected,
        history,
        beforeAdd,
        addProductToWishlist,
        item,
        fetchUserDetails,
        client,
        trackAddToWishlist,
        operations.getProductsInWishlistsQuery,
        customerWishlistProducts,
        afterAdd
    ]);

    const loginToastProps = useMemo(() => {
        if (showLoginToast) {
            return {
                type: 'info',
                message: formatMessage({
                    id: 'wishlist.galleryButton.loginMessage',
                    defaultMessage: 'Please sign-in to your Account to save items for later.'
                }),
                timeout: 5000
            };
        }

        return null;
    }, [formatMessage, showLoginToast]);

    const successToastProps = useMemo(() => {
        if (addProductData) {
            return {
                type: 'success',
                message: formatMessage({
                    id: 'wishlist.galleryButton.successMessageGeneral',
                    defaultMessage: 'Item successfully added to your wishlist.'
                }),
                timeout: 5000
            };
        }

        return null;
    }, [addProductData, formatMessage]);

    const errorToastProps = useMemo(() => {
        if (errorAddingProduct) {
            return {
                type: 'error',
                message: formatMessage({
                    id: 'wishlist.galleryButton.addError',
                    defaultMessage: 'Something went wrong adding the product to your wishlist.'
                }),
                timeout: 5000
            };
        }

        return null;
    }, [errorAddingProduct, formatMessage]);

    const buttonProps = useMemo(
        () => ({
            'aria-label': formatMessage({
                id: 'wishlistButton.addText',
                defaultMessage: 'Add to Favorites'
            }),
            isDisabled: false,
            onPress: handleClick,
            type: 'button'
        }),
        [formatMessage, handleClick]
    );

    return {
        buttonProps,
        buttonText: props.buttonText && props.buttonText(isSelected),
        customerWishlistProducts,
        errorToastProps,
        handleClick,
        isSelected,
        loginToastProps,
        successToastProps
    };
};
