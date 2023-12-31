import { array, arrayOf, shape, string } from 'prop-types';
import React, { useMemo, useCallback } from 'react';
import { ChevronDown as ArrowDown } from 'react-feather';
import { FormattedMessage, useIntl } from 'react-intl';

import { Hamburger } from '@app/components/Icons';
import Button from '@app/components/overrides/Button';
import { useDropdown } from '@magento/peregrine/lib/hooks/useDropdown';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './productSort.module.css';
import SortItem from './sortItem';

const ProductSort = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { availableSortMethods, sortProps } = props;
    const [currentSort, setSort] = sortProps;
    const { elementRef, expanded, setExpanded } = useDropdown();
    const { formatMessage, locale } = useIntl();

    const orderSortingList = useCallback(
        list => {
            return list.sort((a, b) => {
                return a.text.localeCompare(b.text, locale, {
                    sensitivity: 'base'
                });
            });
        },
        [locale]
    );

    const sortMethodsFromConfig = availableSortMethods
        ? availableSortMethods
              .map(method => {
                  const { value, label } = method;
                  const descAttributes = ['created_at', 'bestsellers'];
                  if (value !== 'price' && value !== 'position') {
                      const translatedText = formatMessage({
                          id: `sortItem.${value}`,
                          defaultMessage: label
                      });
                      return {
                          id: `sortItem.${value}`,
                          text: translatedText,
                          attribute: value,
                          sortDirection: descAttributes.includes(value) ? 'DESC' : 'ASC'
                      };
                  }
              })
              .filter(method => !!method)
        : null;

    // Click event for menu items
    const handleItemClick = useCallback(
        sortAttribute => {
            setSort({
                sortText: sortAttribute.text,
                sortId: sortAttribute.id,
                sortAttribute: sortAttribute.attribute,
                sortDirection: sortAttribute.sortDirection
            });
            setExpanded(false);
        },
        [setExpanded, setSort]
    );

    const sortElements = useMemo(() => {
        // Should be not render item in collapsed mode.
        if (!expanded) {
            return null;
        }

        const defaultSortMethods = [
            {
                id: 'sortItem.priceDesc',
                text: formatMessage({
                    id: 'sortItem.priceDesc',
                    defaultMessage: 'Price: High to Low'
                }),
                attribute: 'price',
                sortDirection: 'DESC'
            },
            {
                id: 'sortItem.priceAsc',
                text: formatMessage({
                    id: 'sortItem.priceAsc',
                    defaultMessage: 'Price: Low to High'
                }),
                attribute: 'price',
                sortDirection: 'ASC'
            }
        ];

        const allSortingMethods = sortMethodsFromConfig
            ? orderSortingList([sortMethodsFromConfig, defaultSortMethods].flat())
            : defaultSortMethods;

        const itemElements = Array.from(allSortingMethods, sortItem => {
            const { attribute, sortDirection } = sortItem;

            const isActive = currentSort.sortAttribute === attribute && currentSort.sortDirection === sortDirection;

            const key = `${attribute}--${sortDirection}`;
            return (
                <div key={key} className={classes.menuItem}>
                    <SortItem sortItem={sortItem} active={isActive} onClick={handleItemClick} />
                </div>
            );
        });

        return (
            <div className={classes.menu}>
                <div>{itemElements}</div>
            </div>
        );
    }, [
        classes.menu,
        classes.menuItem,
        currentSort.sortAttribute,
        currentSort.sortDirection,
        expanded,
        formatMessage,
        handleItemClick,
        orderSortingList,
        sortMethodsFromConfig
    ]);

    // Expand or collapse on click
    const handleSortClick = () => {
        setExpanded(!expanded);
    };

    return (
        <div ref={elementRef} className={classes.root} data-cy="ProductSort-root" aria-live="polite" aria-busy="false">
            <Button
                priority="normal"
                classes={{
                    root_normalPriority: classes.sortButton
                }}
                onClick={handleSortClick}
                data-cy="ProductSort-sortButton"
            >
                <div className={classes.mobileText}>
                    <Hamburger />
                    <FormattedMessage id="productSort.sortButton" defaultMessage="Sort" />
                </div>
                <span className={classes.desktopText}>
                    <span className={classes.sortText}>
                        <FormattedMessage id="productSort.sortBtn" defaultMessage="Sort by: " />
                        <span className={classes.currentSort}>{currentSort.sortText}</span>
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

ProductSort.propTypes = {
    classes: shape({
        menuItem: string,
        menu: string,
        root: string,
        sortButton: string
    }),
    availableSortMethods: arrayOf(
        shape({
            label: string,
            value: string
        })
    ),
    sortProps: array
};

export default ProductSort;
