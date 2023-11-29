import { useMutation } from '@apollo/client';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

import defaultOperations from '@app/components/overrides/WishlistPage/wishlistItem.gql';
import { useToasts } from '@magento/peregrine';
import { useCartContext } from '@magento/peregrine/lib/context/cart';
import mergeOperations from '@magento/peregrine/lib/util/shallowMerge';

const SUPPORTED_PRODUCT_TYPES = ['SimpleProduct', 'ConfigurableProduct'];

const mergeSupportedProductTypes = (supportedProductTypes = []) => {
    const newSupportedProductTypes = [...SUPPORTED_PRODUCT_TYPES];

    if (supportedProductTypes) {
        newSupportedProductTypes.push(...supportedProductTypes);
    }

    return newSupportedProductTypes;
};

/**
 *
 * @param item
 * @param onOpenAddToCartDialog
 * @param supportedProductTypes
 * @param propsOperations
 * @returns {{isSupportedProductType: boolean, hasError: boolean, addToCartButtonProps: {onClick: function(): Promise<void>, disabled}}}
 */
export const useRoutineItem = ({ item, onOpenAddToCartDialog, supportedProductTypes, operations: propsOperations }) => {
    const { configurable_options: selectedConfigurableOptions = [], product, quantity } = item;
    const [, { addToast }] = useToasts();
    const { formatMessage } = useIntl();

    const {
        configurable_options: configurableOptions = [],
        __typename: productType,
        sku,
        stock_status: stockStatus
    } = product;

    const isSupportedProductType = useMemo(
        () => mergeSupportedProductTypes(supportedProductTypes).includes(productType),
        [supportedProductTypes, productType]
    );

    const operations = mergeOperations(defaultOperations, propsOperations);
    const { addWishlistItemToCartMutation } = operations;

    const [{ cartId }] = useCartContext();

    const cartItem = useMemo(() => {
        const item = {
            quantity,
            sku
        };

        // Merge in additional input variables for configurable items
        if (selectedConfigurableOptions.length && selectedConfigurableOptions.length === configurableOptions.length) {
            const selectedOptionsArray = selectedConfigurableOptions.map(selectedOption => {
                const {
                    configurable_product_option_uid: attributeId,
                    configurable_product_option_value_uid: selectedValueId
                } = selectedOption;
                const configurableOption = configurableOptions.find(option => option.attribute_id_v2 === attributeId);
                const configurableOptionValue = configurableOption.values.find(
                    optionValue => optionValue.value_index === selectedValueId
                );

                return configurableOptionValue.uid;
            });

            Object.assign(item, {
                selected_options: selectedOptionsArray
            });
        }

        return item;
    }, [configurableOptions, quantity, selectedConfigurableOptions, sku]);

    const [
        addWishlistItemToCart,
        { error: addWishlistItemToCartError, loading: addWishlistItemToCartLoading }
    ] = useMutation(addWishlistItemToCartMutation, {
        variables: {
            cartId,
            cartItem
        }
    });

    const handleAddToCart = useCallback(async () => {
        if (configurableOptions.length === 0 || selectedConfigurableOptions.length === configurableOptions.length) {
            try {
                await addWishlistItemToCart();
                addToast({
                    type: 'success',
                    message: formatMessage(
                        {
                            id: 'wishlist.addToCart',
                            defaultMessage: ' {qty} {name} added to cart'
                        },
                        { name: product.name, qty: 1 }
                    )
                });
            } catch (error) {
                console.error(error);
            }
        } else {
            onOpenAddToCartDialog(item);
        }
    }, [
        addToast,
        addWishlistItemToCart,
        configurableOptions.length,
        formatMessage,
        item,
        onOpenAddToCartDialog,
        product.name,
        selectedConfigurableOptions.length
    ]);

    const isInStock = stockStatus !== 'OUT_OF_STOCK';
    const addToCartButtonProps = useMemo(() => {
        return {
            disabled: addWishlistItemToCartLoading || !isInStock,
            onClick: handleAddToCart
        };
    }, [addWishlistItemToCartLoading, handleAddToCart, isInStock]);

    return {
        addToCartButtonProps,
        hasError: !!addWishlistItemToCartError,
        isSupportedProductType
    };
};
