import React from 'react';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './tags.module.css';
import { Link } from 'react-router-dom';
import { bool, string } from 'prop-types';
import { useAccordion } from '@amasty/blog-pro/src/talons/useAccordion';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import { getURL } from '@amasty/blog-pro/src/utils';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';

const Tags = props => {
  const { title, accordionEnabled } = props;
  const { tags } = useAmBlogProContext();
  const { isOpen, handleToggle } = useAccordion({ accordionEnabled });

  const classes = mergeClasses(defaultClasses, props.classes);

  if (!tags || !tags.length) {
    return null;
  }

  const tagList = tags.map(({ tag_id, url_key, name }) => (
    <Link
      key={tag_id}
      className={classes.item}
      to={getURL(BLOG_URLS_BY_SECTION.TAG, url_key)}
      title={name}
    >
      {name}
    </Link>
  ));

  return (
    <div className={`${classes.root} ${classes.gridArea}`}>
      <div className={classes.title}>
        <Trigger action={handleToggle}>{title}</Trigger>
      </div>
      {isOpen && <div className={classes.list}>{tagList}</div>}
    </div>
  );
};

Tags.propTypes = {
  title: string,
  accordionEnabled: bool
};

Tags.defaultProps = {
  title: 'Tags',
  accordionEnabled: false
};

export default Tags;
