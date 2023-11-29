import { useAppContext } from '@magento/peregrine/lib/context/app';

/**
 * @returns {{
 *  hasOverlay: boolean
 * }}
 */
export const useMainLayout = () => {
    const [appState] = useAppContext();
    const { overlay } = appState;

    return {
        hasOverlay: !!overlay
    };
};
