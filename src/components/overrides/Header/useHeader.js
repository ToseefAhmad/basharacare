import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useHeader = () => {
    const [{ hasBeenOffline, isOnline, isPageLoading }] = useAppContext();

    return {
        hasBeenOffline,
        isOnline,
        isPageLoading
    };
};
