import { useCallback, useState, useEffect } from 'react';
import { useMutation } from '@apollo/client';
import LEAVE_VOTE from '@amasty/blog-pro/src/queries/leaveVoteMutation.graphql';
import { VOTE_TYPES } from '@amasty/blog-pro/src/constants';

export const useVote = props => {
  const { postId } = props;

  const [leaveVote] = useMutation(LEAVE_VOTE, {
    fetchPolicy: 'no-cache'
  });

  const [voteInfo, setVoteInfo] = useState(null);

  const handleSubmit = useCallback(
    async (type = VOTE_TYPES.UPDATE) => {
      try {
        const { data } = await leaveVote({
          variables: {
            type,
            postId
          }
        });

        const { AmBlogLeaveVote } = data || {};
        const { voted } = AmBlogLeaveVote || {};
        setVoteInfo(voted);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(error);
        }
      }
    },
    [postId, setVoteInfo, leaveVote]
  );

  useEffect(() => {
    handleSubmit();
  }, [handleSubmit]);

  return {
    voteInfo,
    handleSubmit,
    handlePlus: () => handleSubmit(VOTE_TYPES.PLUS),
    handleMinus: () => handleSubmit(VOTE_TYPES.MINUS)
  };
};
