import classNames from 'classnames';
import React, { useState } from 'react';
import { ChevronDown as ChevronDownIcon, ChevronUp as ChevronUpIcon } from 'react-feather';
import { FormattedMessage as FormattedMessageDynamic } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './productTabs.module.css';

const ProductTabs = ({ classes: propClasses, data }) => {
    const classes = useStyle(defaultClasses, propClasses);

    const [openedTab, openTab] = useState('general');

    const tabs = data.map(item => (
        <div key={item.id} role="presentation" className={classes.tab} onClick={() => openTab(item.id)}>
            <div className={classes.tabTitle}>
                <FormattedMessageDynamic id={`productFullDetail.tabs.${item.id}`} defaultMessage={item.title} />
                <Icon src={openedTab == item.id ? ChevronDownIcon : ChevronUpIcon} size={30} />
            </div>
            <div
                className={classNames({
                    [classes.contentOpen]: openedTab === item.id,
                    [classes.contentHidden]: openedTab != item.id
                })}
            >
                {item.content}
            </div>
        </div>
    ));

    return <div className={classes.tabs}>{tabs}</div>;
};

export default ProductTabs;
