import { useMutation } from '@apollo/client';
import { useCallback, useState, useMemo } from 'react';
import LEAVE_COMMENT from '@amasty/blog-pro/src/queries/leaveCommentMutation.graphql';
import { useUserContext } from '@magento/peregrine/lib/context/user';
import { useCommentContext } from '@amasty/blog-pro/src/components/Comments/comments';
import { useAppContext } from '@magento/peregrine/lib/context/app';

export const useCommentForm = props => {
  const { postId, replyTo } = props;

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [leaveComment] = useMutation(LEAVE_COMMENT, {
    fetchPolicy: 'no-cache'
  });

  const { updateComments, cancelHandler: closeForm } = useCommentContext();
  const [{ currentUser, isSignedIn }] = useUserContext();

  const initialValues = useMemo(() => {
    const { firstname, lastname, email } = currentUser;
    const name = firstname && lastname ? [firstname, lastname].join(' ') : '';

    return {
      name,
      email,
      message: ''
    };
  }, [currentUser]);

  const handleSubmit = useCallback(
    async formValues => {
      setIsSubmitting(true);

      try {
        const { name, email, message } = formValues;

        const { data } = await leaveComment({
          variables: {
            name,
            email,
            message,
            postId,
            replyTo
          }
        });

        const { AmBlogLeaveComment } = data || {};
        const { comment } = AmBlogLeaveComment || {};

        updateComments(comment);
        setIsSubmitting(false);
        closeForm();
      } catch (_error) {
        if (process.env.NODE_ENV === 'development') {
          console.error(_error);
        }
        setIsSubmitting(false);
      }
    },
    [postId, leaveComment, replyTo, updateComments, setIsSubmitting, closeForm]
  );

  const [, { toggleDrawer }] = useAppContext();

  const handleSignIn = useCallback(() => {
    toggleDrawer('nav');
  }, [toggleDrawer]);

  return {
    initialValues,
    isDisabled: isSubmitting,
    handleSubmit,
    isSignedIn,
    handleSignIn
  };
};
