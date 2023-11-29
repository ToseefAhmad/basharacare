import { useWindowSize } from '@magento/peregrine/lib/hooks/useWindowSize';

const SCREEN_SM = 640;

export const useScreenSize = () => {
    const { innerWidth } = useWindowSize();

    const isMobileScreen = innerWidth < SCREEN_SM;

    return {
        isMobileScreen
    };
};
