import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import CommentForm from '@amasty/blog-pro/src/components/Comments/commentForm';
import defaultClasses from './comments.module.css';
import { useCommentContext } from '@amasty/blog-pro/src/components/Comments/comments';
import { COMMENT_STATUS, GUEST_NAME } from '@amasty/blog-pro/src/constants';
import { number, string } from 'prop-types';

const APPROVAL_MESSAGE =
  'This comment will become public after administrator approval.';

const CommentItem = props => {
  const {
    comment_id: commentId,
    post_id,
    message,
    created_at,
    name,
    status
  } = props;

  const {
    replyId,
    replyHandler,
    cancelHandler,
    newCommentIds
  } = useCommentContext();

  const isShowReplyForm = replyId === commentId;
  const willApprowal =
    Number(status) === COMMENT_STATUS.PENDING &&
    newCommentIds.some(id => id === commentId);

  const classes = mergeClasses(defaultClasses, props.classes);

  if (Number(status) !== COMMENT_STATUS.APPROVED && !willApprowal) {
    return null;
  }

  return (
    <div className={classes.commentItem}>
      <div className={classes.header}>
        <div className={classes.author}>
          <span className={classes.icon} />
          <span className={classes.label}>By</span>
          <span className={classes.userName}>{name || GUEST_NAME}</span>
        </div>
        <div className={classes.date}>{created_at}</div>
      </div>

      <div className={classes.message}>{message}</div>
      <div className={classes.reply}>
        <button
          className={classes.replyBtn}
          onClick={() => replyHandler(commentId)}
        >
          Reply
        </button>
      </div>

      {willApprowal && (
        <div className={classes.willApprowal}>{APPROVAL_MESSAGE}</div>
      )}

      {isShowReplyForm && (
        <div className={classes.replyForm}>
          <CommentForm
            postId={+post_id}
            replyTo={commentId}
            cancelHandler={cancelHandler}
          />
        </div>
      )}
    </div>
  );
};

CommentItem.propTypes = {
  post_id: string,
  comment_id: number
};

export default CommentItem;
