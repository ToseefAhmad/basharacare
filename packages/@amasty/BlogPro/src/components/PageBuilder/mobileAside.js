import React, { Fragment } from 'react';
import Button from '@magento/venia-ui/lib/components/Button';
import { Modal } from '@magento/venia-ui/lib/components/Modal';
import Trigger from '@magento/venia-ui/lib/components/Trigger';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from './modal.module.css';
import { X as CloseIcon } from 'react-feather';
import { bool, func } from 'prop-types';

const MobileAside = props => {
  const { handleClose, handleOpen, isOpen, children, position } = props;

  const classes = mergeClasses(defaultClasses, props.classes);
  const rootClass = isOpen ? classes.root_open : classes.root;

  return (
    <Fragment>
      <div className={classes.swipeBtnContainer}>
        <Button className={classes.swipeBtn} onClick={handleOpen} />
      </div>

      <Modal>
        <aside className={`${rootClass} ${classes[position]}`}>
          <div className={classes.header}>
            <Trigger action={handleClose}>
              <Icon src={CloseIcon} />
            </Trigger>
            <h2 className={classes.title}>Optional menu</h2>
          </div>
          <div className={`${classes.body} ${classes.asideContent}`}>
            {children}
          </div>
        </aside>
      </Modal>
    </Fragment>
  );
};

MobileAside.propTypes = {
  isOpen: bool,
  handleClose: func,
  handleOpen: func
};

MobileAside.defaultProps = {};

export default MobileAside;
