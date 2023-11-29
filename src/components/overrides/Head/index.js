import { useQuery, gql } from '@apollo/client';
import React, { useEffect, useMemo, useRef } from 'react';
export { default as HeadProvider } from '@magento/venia-ui/lib/components/Head/headProvider';
import { Helmet } from 'react-helmet-async';
import { useLocation } from 'react-router-dom';

import { useTracking } from '@app/hooks/useTracking';
import BrowserPersistence from '@magento/peregrine/lib/util/simplePersistence';
Helmet.defaultProps.defer = false;

export const Link = props => {
    const { children, ...tagProps } = props;
    return (
        <Helmet>
            <link {...tagProps}>{children}</link>
        </Helmet>
    );
};

export const Meta = props => {
    const { children, ...tagProps } = props;
    return (
        <Helmet>
            <meta {...tagProps}>{children}</meta>
        </Helmet>
    );
};

export const Style = props => {
    const { children, ...tagProps } = props;
    return (
        <Helmet>
            <style {...tagProps}>{children}</style>
        </Helmet>
    );
};

export const Title = props => {
    const { children, skipPageView, ...tagProps } = props;
    const lastLocation = useRef('');
    const location = useLocation();
    const { trackPageView, trackPwaInstall, trackPwaUninstall } = useTracking();

    useEffect(() => {
        // Track page view when URL changes and we have a valid title
        if (lastLocation.current !== location.key && !skipPageView && children) {
            lastLocation.current = location.key;
            trackPageView({
                title: children
            });
        }

        const storage = new BrowserPersistence();

        // Track PWA installation for Chrome
        window.addEventListener('appinstalled', () => {
            const isPwaInstalled = storage.getItem('IS_PWA_INSTALLED');

            if (!isPwaInstalled) {
                storage.setItem('IS_PWA_INSTALLED', true);
                trackPwaInstall({});
            }
        });

        // Track PWA installation general
        if (navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
            const isPwaInstalled = storage.getItem('IS_PWA_INSTALLED');

            if (!isPwaInstalled) {
                storage.setItem('IS_PWA_INSTALLED', true);
                trackPwaInstall({});
            }
        }

        // Track PWA uninstallation for Chrome
        window.addEventListener('beforeinstallprompt', () => {
            const isPwaInstalled = storage.getItem('IS_PWA_INSTALLED');

            if (isPwaInstalled) {
                storage.setItem('IS_PWA_INSTALLED', false);
                trackPwaUninstall({});
            }
        });
    }, [location.key, skipPageView, children, trackPageView, trackPwaInstall, trackPwaUninstall]);

    return (
        <Helmet>
            <title {...tagProps}>{children}</title>
        </Helmet>
    );
};

const STORE_NAME_QUERY = gql`
    query getStoreName {
        # eslint-disable-next-line @graphql-eslint/require-id-when-available
        storeConfig {
            store_code
            store_name
        }
    }
`;

export const StoreTitle = props => {
    const { children, ...tagProps } = props;

    const { data: storeNameData } = useQuery(STORE_NAME_QUERY);

    const storeName = useMemo(() => {
        return storeNameData ? storeNameData.storeConfig.store_name : STORE_NAME;
    }, [storeNameData]);

    let titleText;
    if (children) {
        titleText = `${children} - ${storeName}`;
    } else {
        titleText = storeName;
    }

    return (
        <Title skipPageView={!children} {...tagProps}>
            {titleText}
        </Title>
    );
};
