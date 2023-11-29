import React, { Fragment } from 'react';
import List from '@amasty/blog-pro/src/components/List';
import FeaturedPosts from '@amasty/blog-pro/src/components/FeaturedPosts';
import { Meta, Title } from '@magento/venia-ui/lib/components/Head';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../root.module.css';
import Breadcrumbs from '@amasty/blog-pro/src/components/Breadcrumbs';

const HomePage = props => {
  const { settings, blogTitle } = useAmBlogProContext();
  const {
    search_engine_meta_title,
    search_engine_meta_description,
    search_engine_meta_keywords,
    search_engine_bread
  } = settings || {};

  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <Fragment>
      <Title>{search_engine_meta_title || blogTitle}</Title>
      <Meta name="description" content={search_engine_meta_description} />
      <Meta name="keywords" content={search_engine_meta_keywords} />

      <Breadcrumbs
        pageTitle={search_engine_bread || blogTitle}
        classes={{ gridArea: classes.breadcrumbs }}
      />

      <h1 className={classes.heading}>{blogTitle}</h1>

      <div className={classes.featuredPosts}>
        <FeaturedPosts />
      </div>

      <List />
    </Fragment>
  );
};

export default HomePage;
