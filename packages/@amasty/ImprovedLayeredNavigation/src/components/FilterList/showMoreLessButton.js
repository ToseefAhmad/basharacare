import { bool, func, number, shape, string } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import { mergeClasses } from '@magento/venia-ui/lib/classify';

import defaultClasses from './filterList.css';


const ShowMoreLessButton = props => {
  const {
    itemCountToShow,
    itemsLength,
    isListExpanded,
    handleListToggle
  } = props;
  const { formatMessage } = useIntl();

  if (!itemCountToShow || itemsLength <= itemCountToShow) {
    return null;
  }

  const count = itemsLength - itemCountToShow;

  const label = isListExpanded
    ? formatMessage({
        id: 'filterList.showLess',
        defaultMessage: 'Show Less'
      })
    : formatMessage(
        {
          id: 'amIln.showMore',
          defaultMessage: 'Show ({count}) More'
        },
        { count }
      );

  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <button
      onClick={handleListToggle}
      className={classes.showMoreLessButton}
      type="button"
    >
      {label}
    </button>
  );
};

ShowMoreLessButton.propTypes = {
  itemCountToShow: number,
  itemsLength: number,
  isListExpanded: bool,
  handleListToggle: func,
  classes: shape({
    root: string
  })
};

export default ShowMoreLessButton;
