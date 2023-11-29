import React, { useState } from 'react';
import { ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

import defaultClasses from './productTabs.module.css';

const ProductTabsShimmer = ({ classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);

    const [openedTab, openTab] = useState('general');

    return (
        <div className={classes.tabs}>
            <div key="general" role="presentation" className={classes.tab} onClick={() => openTab('general')}>
                <div className={classes.tabTitle}>
                    <Shimmer width="20%" height={3} key="tabs-general" />
                    <Icon src={openedTab == 'general' ? ChevronDownIcon : ChevronUpIcon} size={30} />
                </div>
                <div className={openedTab == 'general' ? classes.contentOpen : classes.contentHidden}>
                    <Shimmer height={15} width="100%" key="tabs-general-2" />
                </div>
            </div>
            <div key="howToUse" role="presentation" className={classes.tab} onClick={() => openTab('howToUse')}>
                <div className={classes.tabTitle}>
                    <Shimmer width={10} height={3} key="tabs-howToUse" />
                    <Icon src={openedTab == 'howToUse' ? ChevronDownIcon : ChevronUpIcon} size={30} />
                </div>
                <div className={openedTab == 'howToUse' ? classes.contentOpen : classes.contentHidden}>
                    <Shimmer height={15} width="100%" key="tabs-howToUse-2" />
                </div>
            </div>
            <div key="ingredients" role="presentation" className={classes.tab} onClick={() => openTab('ingredients')}>
                <div className={classes.tabTitle}>
                    <Shimmer width={10} height={3} key="tabs-ingredients" />
                    <Icon src={openedTab == 'ingredients' ? ChevronDownIcon : ChevronUpIcon} size={30} />
                </div>
                <div className={openedTab == 'ingredients' ? classes.contentOpen : classes.contentHidden}>
                    <Shimmer height={15} width="100%" key="tabs-ingredients-2" />
                </div>
            </div>
        </div>
    );
};

export default ProductTabsShimmer;
