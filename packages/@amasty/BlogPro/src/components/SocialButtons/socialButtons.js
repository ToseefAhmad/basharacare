import React, { useMemo } from 'react';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { getAllNetworks } from '@amasty/blog-pro/src/components/SocialButtons/networksConfig';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './socialButtons.module.css';
import { string } from 'prop-types';

const SocialButtons = props => {
  const { settings } = useAmBlogProContext() || {};
  const { social_buttons: socialButtons } = settings;
  const { href } = window.location;

  const enabledNetworks = useMemo(() => {
    return socialButtons
      ? getAllNetworks({ ...props, url: href }).filter(
          ({ name }) => socialButtons.indexOf(name) !== -1
        )
      : null;
  }, [socialButtons, props, href]);

  if (!enabledNetworks) {
    return null;
  }

  const classes = mergeClasses(defaultClasses, props.classes);

  const socButtonList = enabledNetworks.map(({ url, label, name }) => {
    return (
      <li className={classes.item} key={name}>
        <a className={classes.btn} href={url} target="_blank" title={label}>
          <span className={`${classes.icon} ${classes[name]}`} />
        </a>
      </li>
    );
  });

  return (
    <div className={classes.root}>
      <ul className={classes.list}>{socButtonList}</ul>
    </div>
  );
};

SocialButtons.propTypes = {
  title: string,
  description: string,
  image: string
};

export default SocialButtons;
