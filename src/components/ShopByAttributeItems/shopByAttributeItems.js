import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import classes from '@app/RootComponents/ShopByAttribute/shopByAttribute.module.css';
import resourceUrl from '@magento/peregrine/lib/util/makeUrl';

const ShopByAttributeItems = ({ items, attributeFilter }) => {
    const itemGroups = !items ? (
        <FormattedMessage id="ShopByAttributePage.noResultImportant" defaultMessage="No results found!" />
    ) : (
        Object.keys(items)
            .sort((a, b) => a.localeCompare(b))
            .filter(item => attributeFilter.includes(item))
            .map(item => {
                const { children } = items[item];

                const childrenData = children.map(child => {
                    return (
                        <div className={classes.attributeGroupItem} key={child.value}>
                            <Link to={resourceUrl(child.url_alias)}>{child.label}</Link>
                        </div>
                    );
                });
                return (
                    <div className={classes.attributeGroup} key={item}>
                        <h3 className={classes.attributeKey}>{item}</h3>
                        <div className={classes.attributeList}>{childrenData}</div>
                    </div>
                );
            })
    );

    return itemGroups;
};

export default ShopByAttributeItems;
