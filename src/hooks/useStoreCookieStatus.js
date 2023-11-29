import { useCallback } from 'react';
import { useCookies } from 'react-cookie';

// Used to store current store status in cookie
// Used in varnish to redirect customer to correct place when they enter the site
export const useStoreCookieStatus = () => {
    const [, setCookie] = useCookies();

    const setStoreCookieStatus = useCallback(
        (storeCode, locale) => {
            const expires = new Date(new Date().setFullYear(new Date().getFullYear() + 1));

            setCookie('store-switcher-code', storeCode, {
                path: '/'
            });

            setCookie('store-locale', locale, {
                expires,
                path: '/'
            });
        },
        [setCookie]
    );

    return {
        setStoreCookieStatus
    };
};
