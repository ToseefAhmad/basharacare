import React, { useRef } from 'react';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './megaMenu.module.css';
import MegaMenuItem from './megaMenuItem';
import { useMegaMenu } from './useMegaMenu';

/**
 * The MegaMenu component displays menu with categories on desktop devices
 */
const MegaMenu = props => {
    const mainNavRef = useRef(null);

    const {
        megaMenuData,
        activeCategoryId,
        subMenuState,
        disableFocus,
        handleSubMenuFocus,
        categoryUrlSuffix,
        handleNavigate,
        handleClickOutside
    } = useMegaMenu({ mainNavRef });

    const classes = useStyle(defaultClasses, props.classes);

    const items = megaMenuData.children
        ? megaMenuData.children.map(category => {
              return category.uid != 'OTg=' ? (
                  <MegaMenuItem
                      category={category}
                      activeCategoryId={activeCategoryId}
                      categoryUrlSuffix={categoryUrlSuffix}
                      onNavigate={handleNavigate}
                      key={category.uid}
                      subMenuState={subMenuState}
                      disableFocus={disableFocus}
                      handleSubMenuFocus={handleSubMenuFocus}
                      handleClickOutside={handleClickOutside}
                  />
              ) : null;
          })
        : null;

    return (
        <nav
            ref={mainNavRef}
            className={classes.megaMenu}
            data-cy="MegaMenu-megaMenu"
            role="navigation"
            onFocus={handleSubMenuFocus}
        >
            {items}
        </nav>
    );
};

export default MegaMenu;
