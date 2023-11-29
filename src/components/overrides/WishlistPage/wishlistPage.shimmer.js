import { shape, string } from 'prop-types';
import React from 'react';

import WishlistItemsShimmer from '@app/components/overrides/WishlistPage/wishlistItems.shimmer';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const WishlistPageShimmer = ({ itemsCount }) => {
    const placeholderItems = Array.from({ length: itemsCount }).fill(null);

    return (
        <div>
            <Shimmer height="40px" width={20} />
            <WishlistItemsShimmer items={placeholderItems} />
        </div>
    );
};

WishlistPageShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default WishlistPageShimmer;
