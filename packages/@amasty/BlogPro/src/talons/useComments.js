import { useCallback, useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import GET_COMMENTS from '@amasty/blog-pro/src/queries/getComments.graphql';
import { buildTree } from '@amasty/blog-pro/src/utils';

export const useComments = props => {
  const { postId } = props;

  const { loading, error, data, refetch } = useQuery(GET_COMMENTS, {
    fetchPolicy: 'cache-and-network',
    nextFetchPolicy: 'cache-first',
    variables: {
      postId,
      type: 'list'
    }
  });

  const [replyId, setReplyId] = useState(null);
  const [newCommentIds, setNewCommentIds] = useState([]);

  const { amBlogComments } = data || {};
  const { items = [] } = amBlogComments || {};

  const comments = useMemo(
    () =>
      buildTree({
        items,
        parentKey: 'reply_to',
        itemKey: 'comment_id'
      }),
    [items]
  );

  const replyHandler = useCallback(id => setReplyId(id), [setReplyId]);

  const cancelHandler = useCallback(() => setReplyId(null), [setReplyId]);

  const updateComments = useCallback(
    comment => {
      const { comment_id } = comment || {};
      setNewCommentIds([...newCommentIds, comment_id]);
      return refetch();
    },
    [refetch, setNewCommentIds, newCommentIds]
  );

  return {
    loading,
    error,
    comments,
    replyId,
    replyHandler,
    cancelHandler,
    updateComments,
    newCommentIds
  };
};
