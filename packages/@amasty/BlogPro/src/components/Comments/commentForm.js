import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './commentForm.module.css';
import { Form } from 'informed';
import TextInput from '@magento/venia-ui/lib/components/TextInput';
import {
  isRequired,
  mustBeChecked
} from '@magento/venia-ui/lib/util/formValidators';
import Field from '@magento/venia-ui/lib/components/Field';
import Button from '@magento/venia-ui/lib/components/Button';
import TextArea from '@magento/venia-ui/lib/components/TextArea';
import { useCommentForm } from '@amasty/blog-pro/src/talons/useCommentForm';
import { number } from 'prop-types';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import LoginForm from '@amasty/blog-pro/src/components/Comments/loginForm';
import Checkbox from '@magento/venia-ui/lib/components/Checkbox';
import RichText from '@magento/venia-ui/lib/components/RichText';

const CommentForm = props => {
  const { postId, replyTo, cancelHandler } = props;

  const {
    initialValues,
    handleSubmit,
    isDisabled,
    isSignedIn,
    handleSignIn
  } = useCommentForm({
    postId,
    replyTo
  });

  const { settings } = useAmBlogProContext();
  const {
    comments_allow_guests,
    comments_ask_email,
    comments_ask_name,
    comments_gdpr,
    comments_gdpr_text
  } = settings || {};

  const classes = mergeClasses(defaultClasses, props.classes);

  if (!isSignedIn && !comments_allow_guests) {
    return <LoginForm isReply={!!replyTo} handleSignIn={handleSignIn} />;
  }

  return (
    <div className={classes.root}>
      <Form
        className={classes.form}
        initialValues={initialValues}
        onSubmit={handleSubmit}
      >
        {comments_ask_name && (
          <div className={classes.input}>
            <Field label="Your name" required={true}>
              <TextInput
                field="name"
                autoComplete="given-name"
                placeholder={'Georgy'}
                validate={isRequired}
                validateOnBlur
              />
            </Field>
          </div>
        )}

        {comments_ask_email && (
          <div className={classes.input}>
            <Field label="Your email" required={true}>
              <TextInput
                field="email"
                type="email"
                autoComplete="email"
                placeholder={'example@gmail.com'}
                validate={isRequired}
                validateOnBlur
              />
            </Field>
          </div>
        )}

        <div className={classes.input}>
          <Field label="Your comment" required={true}>
            <TextArea
              field="message"
              autoComplete="message"
              placeholder={'Hi my name is Georgy...'}
              validate={isRequired}
              validateOnBlur
              rows={8}
            />
          </Field>
        </div>

        {comments_gdpr && (
          <div className={classes.gdpr}>
            <Checkbox
              field="gdpr"
              label=""
              validate={mustBeChecked}
              validateOnBlur
            />
            <RichText content={comments_gdpr_text} />
          </div>
        )}

        <div className={classes.actions}>
          <Button disabled={isDisabled} type="submit" priority="high">
            {'Post comment'}
          </Button>
          {replyTo && cancelHandler && (
            <Button onClick={cancelHandler}>{'Cancel'}</Button>
          )}
        </div>
      </Form>
    </div>
  );
};

CommentForm.propTypes = {
  postId: number.isRequired,
  replyTo: number
};

export default CommentForm;
