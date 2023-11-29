import React from 'react';
import { number } from 'prop-types';
import { useVote } from '@amasty/blog-pro/src/talons/useVote';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './vote.module.css';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { ThumbsUp as LikeIcon, ThumbsDown as DislikeIcon } from 'react-feather';

const DEFAULT_LABEL = 'Did you like this post?';

const Vote = props => {
  const { postId } = props;
  const { voteInfo, handlePlus, handleMinus } = useVote({ postId });

  const classes = mergeClasses(defaultClasses, props.classes);

  const { plus = 0, minus = 0 } = voteInfo || {};
  const plusClasses = `${classes.icon} ${classes.plusIcon} ${
    plus > 0 ? classes.plusIconActive : ''
  }`;
  const minusClasses = `${classes.icon} ${classes.minusIcon} ${
    minus > 0 ? classes.minusIconActive : ''
  }`;

  return (
    <div className={classes.root}>
      <span className={classes.label}>{DEFAULT_LABEL}</span>
      <Trigger action={handlePlus} classes={{ root: plusClasses }}>
        <Icon src={LikeIcon} />
      </Trigger>

      <span className={classes.count}>{plus}</span>

      <Trigger action={handleMinus} classes={{ root: minusClasses }}>
        <Icon src={DislikeIcon} />
      </Trigger>

      <span className={classes.count}>{minus}</span>
    </div>
  );
};

Vote.propTypes = {
  postId: number.isRequired
};

export default Vote;
