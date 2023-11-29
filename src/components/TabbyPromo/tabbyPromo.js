import classNames from 'classnames';
import { number, oneOf, string } from 'prop-types';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useIntl } from 'react-intl';

import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import classes from './tabbyPromo.module.css';
import { useTabbyPromo } from './useTabbyPromo';

const TabbyPromoContainer = ({ price, currency, source }) => {
    const { locale } = useIntl();
    const { isEnabled, publicKey, isLoadingConfig } = useTabbyPromo();
    const [showShimmer, setShowShimmer] = useState(true);
    const ref = useRef();
    useEffect(() => {
        if (typeof TabbyPromo === 'function' && isEnabled) {
            new TabbyPromo({
                selector: '#TabbyPromo',
                currency,
                price,
                lang: locale.split('-')[0],
                source,
                api_key: publicKey
            });
        } else if (!isLoadingConfig) {
            setShowShimmer(false);
        }
    }, [locale, price, currency, publicKey, isEnabled, source, isLoadingConfig]);

    const mutationCalback = useCallback(list => {
        list.forEach(item => {
            if (item.addedNodes.length) {
                setShowShimmer(false);
            }
        });
    }, []);

    useEffect(() => {
        if (ref?.current) {
            const observer = new MutationObserver(mutationCalback);
            observer.observe(ref.current, { childList: true });
            return () => observer.disconnect();
        }
    }, [mutationCalback]);

    return (
        <>
            {showShimmer && <Shimmer height="70px" width="100%" />}
            <div
                id="TabbyPromo"
                className={classNames({
                    [classes.hidden]: showShimmer
                })}
                ref={ref}
            />
        </>
    );
};

TabbyPromoContainer.propTypes = {
    price: number,
    currency: string,
    source: oneOf(['cart', 'product'])
};

export default TabbyPromoContainer;
