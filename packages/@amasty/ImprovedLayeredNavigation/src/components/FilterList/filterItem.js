import { func, number, oneOfType, shape, string } from 'prop-types';
import React, { useMemo } from 'react';

import { useFilterItem } from '../../talons/useFilterItem';
import Label from '../Label';

import setValidator from '@magento/peregrine/lib/validators/set';


const FilterItem = props => {
  const { filterState, item, handleSelectItem, itemComponent, ...rest } = props;

  const talonProps = useFilterItem({
    filterState,
    item,
    handleSelectItem
  });
  const { isSelected, tileItem, handleClick } = talonProps;

  const Component = useMemo(() => itemComponent || Label, [itemComponent]);

  return (
    <Component
      isSelected={isSelected}
      item={tileItem}
      onClick={handleClick}
      {...rest}
    />
  );
};

FilterItem.propTypes = {
  filterState: setValidator,
  item: shape({
    title: string.isRequired,
    value: oneOfType([number, string]).isRequired
  }).isRequired,
  onChange: func
};

export default FilterItem;
