import { useState, useEffect, useCallback } from 'react';

export const useItem = props => {
    const { uid, product, quantity, loading, handleRemoveItem, handleUpdateItemQuantity, onProductClick } = props;

    const [isLoading, setIsLoading] = useState(false);

    const removeItem = useCallback(() => {
        setIsLoading(true);
        handleRemoveItem(uid, product, quantity);
    }, [handleRemoveItem, product, quantity, uid]);

    const updateItemQuantity = useCallback(
        quantity => {
            setIsLoading(true);
            handleUpdateItemQuantity(quantity, uid);
        },
        [handleUpdateItemQuantity, uid]
    );

    const handleProductClick = useCallback(() => {
        onProductClick(product);
    }, [onProductClick, product]);

    useEffect(() => {
        !loading && setIsLoading(false);
    }, [loading]);

    return {
        isLoading,
        removeItem,
        updateItemQuantity,
        handleProductClick
    };
};
