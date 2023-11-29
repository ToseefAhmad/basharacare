import { Form } from 'informed';
import PriceSlider from 'packages/@amasty/ImprovedLayeredNavigation/src/components/PriceSlider';
import { func, number, string } from 'prop-types';
import React, { useCallback, useState } from 'react';
import { ChevronDown as ArrowDown, ChevronUp as ArrowUp } from 'react-feather';
import { connectRange } from 'react-instantsearch-dom';

import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './filterBlock.module.css';

const FilterNumeric = connectRange(({ refine, label, min, max }) => {
    const [isExpanded, setIsExpanded] = useState(true);
    const [currentItem, setCurrentItem] = useState(null);
    const onApply = useCallback(
        (group, item) => {
            const values = item.value.split('_');
            refine({ min: values[0], max: values[1] });
        },
        [refine]
    );
    if (!min || !max) {
        return null;
    }

    const iconSrc = isExpanded ? ArrowUp : ArrowDown;
    return (
        <div className={classes.root}>
            <button
                className={classes.trigger}
                onClick={() => setIsExpanded(expanded => !expanded)}
                type="button"
                aria-expanded={isExpanded}
            >
                <span className={classes.header}>
                    <span className={classes.name}>{label}</span>
                    <Icon src={iconSrc} />
                </span>
            </button>
            {isExpanded ? (
                <Form className={classes.slider}>
                    <PriceSlider
                        filterApi={{
                            filterApi: {
                                changeItem: ({ item }) => {
                                    setCurrentItem(item);
                                }
                            }
                        }}
                        filterState={
                            currentItem
                                ? new Set([
                                      {
                                          count: 1,
                                          custom: true,
                                          is_seo_significant: false,
                                          ...currentItem
                                      }
                                  ])
                                : undefined
                        }
                        items={[
                            {
                                value: `${min}_${max}`
                            }
                        ]}
                        onApply={onApply}
                        group="price"
                        filterBlockSettings={{}}
                    />
                </Form>
            ) : null}
        </div>
    );
});

FilterNumeric.propTypes = {
    min: number,
    max: number,
    refine: func,
    label: string
};

const FilterNumericContainer = props => <FilterNumeric {...props} />;

export default FilterNumericContainer;
