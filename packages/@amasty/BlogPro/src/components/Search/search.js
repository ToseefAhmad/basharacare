import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import Button from '@magento/venia-ui/lib/components/Button';
import { Search as SearchIcon } from 'react-feather';
import defaultClasses from './search.module.css';
import { Form } from 'informed';
import { useSearch } from '@amasty/blog-pro/src/talons/useSearch';
import { bool } from 'prop-types';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import { useAccordion } from '@amasty/blog-pro/src/talons/useAccordion';

const Search = props => {
  const { title, accordionEnabled } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  const { inputRef, initialValues, handleSubmit } = useSearch();

  const { isOpen, handleToggle } = useAccordion({ accordionEnabled });

  const searchIcon = <Icon src={SearchIcon} size={18} />;

  return (
    <div className={`${classes.root} ${classes.gridArea}`}>
      <div className={classes.title}>
        <Trigger action={handleToggle}>{title}</Trigger>
      </div>

      {isOpen && (
        <Form
          autoComplete="off"
          className={classes.form}
          initialValues={initialValues}
          onSubmit={handleSubmit}
        >
          <div className={classes.inputRoot}>
            <TextInput
              classes={classes.input}
              before={searchIcon}
              field="search_query"
              forwardedRef={inputRef}
              placeholder="Find some..."
            />
          </div>

          <div className={classes.btnRoot}>
            <Button priority="high" type="submit" classes={classes.button}>
              Search
            </Button>
          </div>
        </Form>
      )}
    </div>
  );
};

Search.propTypes = {
  accordionEnabled: bool
};

Search.defaultProps = {
  title: 'Search the blog',
  accordionEnabled: false
};

export default Search;
