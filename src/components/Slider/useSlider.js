import { useCallback } from 'react';

import { useTracking } from '@app/hooks/useTracking';

export const useSlider = () => {
    const { getProductCategories, trackProductClick } = useTracking();

    const handleProductClick = useCallback(
        product => {
            trackProductClick({
                list: 'Products Slider',
                product: {
                    sku: product.sku,
                    name: product.name,
                    price: product.price_range.maximum_price.final_price.value,
                    currency: product.price_range.maximum_price.final_price.currency,
                    category: getProductCategories(product.categories),
                    brand: product.brand_name
                }
            });
        },
        [getProductCategories, trackProductClick]
    );

    return {
        handleProductClick
    };
};
