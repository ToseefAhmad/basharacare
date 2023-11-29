import Tooltip from '@amasty/iln/src/components/Tooltip';
import { Form } from 'informed';
import { arrayOf, shape, string, func, bool, number, oneOfType } from 'prop-types';
import React from 'react';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import { useIntl } from 'react-intl';

import setValidator from '@magento/peregrine/lib/validators/set';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './filterBlock.module.css';
import FilterList from './FilterList';
import { useFilterBlock } from './useFilterBlock';

const FilterBlock = ({
    filterApi,
    filterState,
    group,
    items,
    name,
    onApply,
    initialOpen,
    currentFilters,
    filterResults,
    ...props
}) => {
    const { formatMessage } = useIntl();
    const talonProps = useFilterBlock({
        filterApi,
        filterState,
        items,
        initialOpen,
        group
    });
    const { handleClick, isExpanded, filterBlockSettings, isHidden } = talonProps;

    const iconSrc = isExpanded ? ArrowUp : ArrowDown;
    const classes = useStyle(defaultClasses, props.classes);
    if (isHidden) return null;

    const itemAriaLabel = formatMessage(
        {
            id: 'filterModal.item.ariaLabel',
            defaultMessage: 'Filter products by "{itemName}"'
        },
        {
            itemName: name
        }
    );

    const toggleItemOptionsAriaLabel = isExpanded
        ? formatMessage(
              {
                  id: 'filterModal.item.hideOptions',
                  defaultMessage: 'Hide "{itemName}" filter item options.'
              },
              {
                  itemName: name
              }
          )
        : formatMessage(
              {
                  id: 'filterModal.item.showOptions',
                  defaultMessage: 'Show "{itemName}" filter item options.'
              },
              {
                  itemName: name
              }
          );
    const list = isExpanded ? (
        <Form className={classes.list}>
            <FilterList
                filterBlockSettings={filterBlockSettings}
                filterResults={filterResults}
                currenFilters={currentFilters}
                filterApi={filterApi}
                filterState={filterState}
                group={group}
                items={items}
                onApply={onApply}
                classes={{ items: classes.items, item: classes.item }}
            />
        </Form>
    ) : null;

    return (
        <div className={classes.root} aria-label={itemAriaLabel} data-cy="FilterBlock-root">
            <button
                className={classes.trigger}
                onClick={handleClick}
                data-cy="FilterBlock-triggerButton"
                type="button"
                aria-expanded={isExpanded}
                aria-label={toggleItemOptionsAriaLabel}
            >
                <span className={classes.header}>
                    <span className={classes.name}>
                        {name}
                        <Tooltip {...talonProps.filterBlockSettings} />
                    </span>
                    <Icon src={iconSrc} />
                </span>
            </button>
            {list}
        </div>
    );
};

FilterBlock.defaultProps = {
    onApply: null,
    initialOpen: false
};

FilterBlock.propTypes = {
    classes: shape({
        header: string,
        list: string,
        name: string,
        root: string,
        trigger: string
    }),
    filterApi: shape({}).isRequired,
    filterState: setValidator,
    group: string.isRequired,
    items: arrayOf(shape({})),
    name: string.isRequired,
    onApply: func,
    initialOpen: oneOfType([bool, number])
};

export default FilterBlock;
