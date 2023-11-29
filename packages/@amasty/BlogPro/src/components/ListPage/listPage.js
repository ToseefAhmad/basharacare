import React, { Fragment } from 'react';
import List from '@amasty/blog-pro/src/components/List';
import { Redirect } from 'react-router-dom';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../root.module.css';
import { Title, Meta } from '@magento/venia-ui/lib/components/Head';
import Breadcrumbs from '../Breadcrumbs/breadcrumbs';
import { useListPage } from '@amasty/blog-pro/src/talons/useListPage';
import { PAGE_TYPES } from '@amasty/blog-pro/src/constants';

const ListPage = props => {
  const {
    itemId,
    name,
    pageTitle,
    meta_tags: metaTags,
    meta_title: metaTitle,
    meta_description: metaDescription,
    pageType
  } = useListPage();

  if (!itemId && pageType !== PAGE_TYPES.SEARCH) {
    return <Redirect to={'/404.html'} />;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <Fragment>
      <Title>{metaTitle || name}</Title>
      <Meta name="description" content={metaDescription} />
      <Meta name="tags" content={metaTags} />

      <Breadcrumbs
        pageTitle={name}
        classes={{ gridArea: classes.breadcrumbs }}
      />

      <h1 className={classes.heading}>{pageTitle}</h1>

      <List id={itemId} />
    </Fragment>
  );
};

export default ListPage;
