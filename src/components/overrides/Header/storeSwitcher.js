import { shape, string } from 'prop-types';
import React, { useMemo } from 'react';
import { ChevronDown, ChevronUp } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import { getDirection } from '@app/hooks/useDirection';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Shimmer from '@magento/venia-ui/lib/components/Header/storeSwitcher.shimmer';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './storeSwitcher.module.css';
import SwitcherItem from './switcherItem';
import { useStoreSwitcher } from './useStoreSwitcher';

const translateStorename = storecode => {
    // Special case, for some reason UAE store code is in different format
    if (storecode == 'ae_en' || storecode == 'ae_ar') {
        return <FormattedMessage id="storeSwitcher.UAE" defaultMessage="UAE" />;
    } else {
        const store = storecode.split('_')[1];
        switch (store) {
            case 'bh':
                return <FormattedMessage id="storeSwitcher.Bahrain" defaultMessage="Bahrain" />;

            case 'kw':
                return <FormattedMessage id="storeSwitcher.Kuwait" defaultMessage="Kuwait" />;

            case 'om':
                return <FormattedMessage id="storeSwitcher.Oman" defaultMessage="Oman" />;

            case 'qa':
                return <FormattedMessage id="storeSwitcher.Qatar" defaultMessage="Qatar" />;

            case 'sa':
                return <FormattedMessage id="storeSwitcher.SaudiArabia" defaultMessage="Saudi Arabia" />;

            default:
                return 'Unknown store';
        }
    }
};

const StoreSwitcher = props => {
    const {
        availableStores,
        currentStoreName,
        currentStoreCode,
        handleSwitchStore,
        storeGroups,
        storeMenuRef,
        storeMenuTriggerRef,
        storeMenuIsOpen,
        handleTriggerClick
    } = useStoreSwitcher();

    const direction = getDirection();
    const languageSwitchProperties = {
        ltr: { label: 'العربية' },
        rtl: { label: 'english' }
    };

    const changeLanguage = () => {
        if (!currentStoreCode) return;
        if (direction && direction === 'ltr') {
            return currentStoreCode.replace('en', 'ar');
        }
        if (direction && direction === 'rtl') {
            return currentStoreCode.replace('ar', 'en');
        }
    };

    const classes = useStyle(defaultClasses, props.classes);
    const menuClassName = storeMenuIsOpen ? classes.menu_open : classes.menu;

    const groups = useMemo(() => {
        const currentLenArr = (currentStoreName || 'UAE English').trim().split(' ');
        const result = [];

        storeGroups.forEach((group, key) => {
            const stores = [];
            const countryStores = [];

            group.forEach(({ storeName, isCurrent, code }) => {
                const storeNameArray = storeName.trim().split(' ');

                if (!countryStores.includes(storeNameArray[0]) && currentLenArr[1] === storeNameArray[1]) {
                    countryStores.push(storeNameArray[0]);
                    /* Translate store names to Arabic*/
                    const translatedStorename = translateStorename(code);
                    stores.push(
                        <li key={code} className={classes.menuItem}>
                            <SwitcherItem
                                active={isCurrent}
                                classes={{ root: classes.menuItemBtn }}
                                onClick={handleSwitchStore}
                                option={code}
                            >
                                {translatedStorename}
                            </SwitcherItem>
                        </li>
                    );
                }
            });

            result.push(
                <ul className={classes.groupList} key={key}>
                    {stores}
                </ul>
            );
        });

        return result;
    }, [classes.groupList, classes.menuItem, classes.menuItemBtn, currentStoreName, handleSwitchStore, storeGroups]);

    if (!availableStores) return <Shimmer />;

    if (availableStores.size <= 1) return null;

    const translatedCurrentStoreName = translateStorename(currentStoreCode);

    return (
        <div className={classes.root}>
            <div className={classes.storeTriggerContainer}>
                <button
                    className={classes.trigger}
                    aria-label={translatedCurrentStoreName}
                    onClick={handleTriggerClick}
                    ref={storeMenuTriggerRef}
                >
                    {translatedCurrentStoreName}
                    <Icon
                        classes={{ root: classes.iconRoot }}
                        src={storeMenuIsOpen ? ChevronUp : ChevronDown}
                        size={15}
                    />
                </button>
                <div ref={storeMenuRef} className={menuClassName}>
                    <div className={classes.groups}>{groups}</div>
                </div>
            </div>
            <div className={classes.languageTriggerContainer}>
                <div className={classes.languageTrigger}>
                    <SwitcherItem onClick={handleSwitchStore} option={direction && changeLanguage()}>
                        {direction && languageSwitchProperties[direction].label}
                    </SwitcherItem>
                </div>
            </div>
        </div>
    );
};

export default StoreSwitcher;

StoreSwitcher.propTypes = {
    classes: shape({
        groupList: string,
        groups: string,
        menu: string,
        menu_open: string,
        menuItem: string,
        menuItemBtn: string,
        root: string,
        trigger: string
    })
};
