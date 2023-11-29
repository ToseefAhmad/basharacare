import { useUserContext } from '@magento/peregrine/lib/context/user';

export const useWishlistTrigger = () => {
    const [{ currentUser }] = useUserContext();
    const { wishlist_count } = currentUser;
    return {
        itemCountDisplay: wishlist_count
    };
};
