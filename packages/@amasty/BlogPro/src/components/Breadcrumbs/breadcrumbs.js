import React, { Fragment } from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './breadcrumbs.module.css';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { string } from 'prop-types';
import { useLocation, Link } from 'react-router-dom';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';

const Breadcrumbs = props => {
  const { pageTitle } = props;
  const { blogTitle, settings } = useAmBlogProContext();
  const classes = mergeClasses(defaultClasses, props.classes);
  const { pathname } = useLocation();
  const { search_engine_bread } = settings;

  const links =
    pathname.replace(/\.html\/?$/, '') !== BLOG_URLS_BY_SECTION.HOME ? (
      <Fragment>
        <span className={classes.divider}>/</span>
        <Link className={classes.link} to="/blog">
          {search_engine_bread || blogTitle}
        </Link>
      </Fragment>
    ) : null;

  return (
    <div className={`${classes.root} ${classes.gridArea}`}>
      <Link className={classes.link} to="/">
        {'Home'}
      </Link>
      {links}
      <span className={classes.divider}>/</span>
      <span className={classes.text}>{pageTitle}</span>
    </div>
  );
};

Breadcrumbs.propTypes = {
  pageTitle: string
};

Breadcrumbs.defaultProps = {
  pageTitle: ''
};

export default Breadcrumbs;
