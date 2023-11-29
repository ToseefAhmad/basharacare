import { array, func } from 'prop-types';
import React, { useCallback, useMemo } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { connectSortBy } from 'react-instantsearch-dom';
import { FormattedMessage } from 'react-intl';

import { Hamburger } from '@app/components/Icons';
import SortItem from '@app/components/overrides/ProductSort/sortItem';
import { useDropdown } from '@magento/peregrine';
import Button from '@magento/venia-ui/lib/components/Button';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './sort.module.css';

const Sort = ({ items, refine }) => {
    const { elementRef, expanded, setExpanded } = useDropdown();

    const handleSortClick = useCallback(() => {
        setExpanded(!expanded);
    }, [setExpanded, expanded]);

    const sortElements = useMemo(() => {
        if (!expanded) {
            return null;
        }

        return (
            <div className={classes.menu}>
                <div>
                    {items.map(item => {
                        return (
                            <div key={item.value} className={classes.menuItem}>
                                <SortItem
                                    active={item.isRefined}
                                    onClick={() => {
                                        handleSortClick();
                                        refine(item.value);
                                    }}
                                    sortItem={{
                                        text: item.label
                                    }}
                                />
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    }, [expanded, handleSortClick, items, refine]);

    return (
        <div className={classes.root} ref={elementRef}>
            <Button
                priority="normal"
                classes={{
                    root_normalPriority: classes.sortButton
                }}
                onClick={handleSortClick}
            >
                <div className={classes.mobileText}>
                    <Hamburger />
                    <FormattedMessage id="productSort.sortButton" defaultMessage="Sort" />
                </div>
                <span className={classes.desktopText}>
                    <span className={classes.sortText}>
                        <FormattedMessage id="productSort.sortBtn" defaultMessage="Sort by: " />
                        <span className={classes.currentSort}>{items.find(item => item.isRefined).label}</span>
                    </span>
                    <Icon
                        src={ArrowDown}
                        classes={{
                            root: classes.desktopIconWrapper,
                            icon: classes.desktopIcon
                        }}
                    />
                </span>
            </Button>
            {sortElements}
        </div>
    );
};

Sort.propTypes = {
    items: array,
    refine: func
};

export default connectSortBy(Sort);
