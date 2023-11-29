import React from 'react';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './commentForm.module.css';
import { Link } from 'react-router-dom';
import Button from '@magento/venia-ui/lib/components/Button';
import { func } from 'prop-types';

const LoginForm = props => {
  const { handleSignIn } = props;
  const classes = mergeClasses(defaultClasses, props.classes);

  return (
    <div className={classes.loginRoot}>
      <p>
        {'Please '}
        <Button className={classes.loginBtn} onClick={handleSignIn}>
          login
        </Button>
        {' to comment.'}
      </p>
      <p>{"Don't have an account?"}</p>
      <p>
        <Link
          className={classes.loginBtn}
          to={'/create-account'}
          title={'Sign Up for free'}
        >
          {'Sign Up for free.'}
        </Link>
      </p>
    </div>
  );
};

LoginForm.propTypes = {
  handleSignIn: func
};

export default LoginForm;
