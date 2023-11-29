import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { useSubMenu } from '@magento/peregrine/lib/talons/MegaMenu/useSubMenu';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './submenu.module.css';

/**
 * The Submenu component displays submenu in mega menu
 *
 * @param {array} props.items - categories to display
 * @param {int} props.mainNavWidth - width of the main nav. It's used for setting min-width of the submenu
 * @param {function} props.onNavigate - function called when clicking on Link
 */
const Submenu = props => {
    const { isFocused, subMenuState, handleCloseSubMenu, items } = props;
    const classes = useStyle(defaultClasses, props.classes);

    const { isSubMenuActive } = useSubMenu({
        isFocused,
        subMenuState,
        handleCloseSubMenu
    });

    const subMenuClassname = isSubMenuActive ? classes.submenu_active : classes.submenu;

    const handleOnClick = () => {
        handleCloseSubMenu();
    };

    const MenuColumn = ({ categoryTitle, category }) => {
        if (!category) {
            return null;
        }

        const attributeList = category.map(item => (
            <div key={item.option_setting_id} onClick={handleOnClick} onKeyDown={handleOnClick} aria-hidden>
                <Link className={classes.listItem} to={`/${item.url_alias}`}>
                    {item.label}
                </Link>
            </div>
        ));

        return (
            <div>
                <div className={classes.listTitle}>{categoryTitle}</div>
                <div className={classes.attributeList}>{attributeList}</div>
            </div>
        );
    };

    const columns = items.length
        ? items.map(({ frontend_label, items, url_page, store_label }) => {
              if (items.length === 0) return;
              return (
                  <div key={frontend_label} className={classes.column}>
                      <MenuColumn key={frontend_label} categoryTitle={store_label} category={items} />
                      <div className={classes.allLink} onClick={handleOnClick} onKeyDown={handleOnClick} aria-hidden>
                          <Link to={`/${url_page}`}>
                              <FormattedMessage id="submenu.seeAll" defaultMessage="See All" />{' '}
                          </Link>
                      </div>
                  </div>
              );
          })
        : null;

    const subMenuItemsClass = classes.submenuItems.replace('grid-cols-4', '');

    return (
        <div className={subMenuClassname}>
            <div className={subMenuItemsClass}>{columns}</div>
            <div className={classes.specialists}>
                <div className={classes.chat}>
                    <div className={classes.chatTitle}>
                        <FormattedMessage id="submenu.haveQuestions" defaultMessage="Have questions?" />
                    </div>
                    <Link className={classes.chatLink} to="/chat">
                        <FormattedMessage id="submenu.chatWithSpecialists" defaultMessage="chat with our specialists" />
                    </Link>
                </div>

                <div>
                    <div className={classes.blogLink}>
                        <Link to="/blog">
                            <div className={classes.blogTitlePrimary}>
                                <FormattedMessage id="submenu.exploreOur" defaultMessage="Explore our" />
                            </div>
                            <div className={classes.blogTitleSecondary}>
                                <FormattedMessage id="submenu.skinCareGuide" defaultMessage="skin and care guide" />
                            </div>
                        </Link>
                    </div>
                    <Link className={classes.blogImageLink} to="/blog">
                        <img alt="blog" src="/pwa/static-files/blog_promo.jpg" />
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Submenu;

Submenu.propTypes = {
    items: PropTypes.arrayOf(
        PropTypes.shape({
            children: PropTypes.array,
            uid: PropTypes.string,
            include_in_menu: PropTypes.number,
            isActive: PropTypes.bool,
            name: PropTypes.string,
            path: PropTypes.array,
            position: PropTypes.number,
            url_path: PropTypes.string
        })
    ),
    mainNavWidth: PropTypes.number,
    categoryUrlSuffix: PropTypes.string,
    onNavigate: PropTypes.func.isRequired,
    handleCloseSubMenu: PropTypes.func.isRequired
};
