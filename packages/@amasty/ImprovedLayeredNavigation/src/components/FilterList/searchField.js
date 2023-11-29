import { func, shape, string } from 'prop-types';
import React from 'react';
import { X as ClearIcon } from 'react-feather';
import { useIntl } from 'react-intl';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Trigger from '@magento/venia-ui/lib/components/Trigger';

import defaultClasses from './searchField.css';



const clearIcon = <Icon src={ClearIcon} size={24} />;

const SearchField = props => {
  const { onChange, reset, value, field } = props;

  const { formatMessage } = useIntl();

  const resetButton = value ? (
    <Trigger action={reset}>{clearIcon}</Trigger>
  ) : null;

  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <div className={classes.root}>
      <TextInput
        placeholder={formatMessage({
          id: 'filterList.search',
          defaultMessage: 'Search'
        })}
        after={resetButton}
        field={field}
        autoComplete="off"
        onValueChange={onChange}
      />
    </div>
  );
};

SearchField.propTypes = {
  onChange: func,
  classes: shape({
    root: string
  })
};

SearchField.defaultProps = {};

export default SearchField;
