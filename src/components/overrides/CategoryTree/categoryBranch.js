import { func, number, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { Accordion, Section } from '@app/components/overrides/Accordion';
import { useCategoryBranch, useCategoryLeaf } from '@magento/peregrine/lib/talons/CategoryTree';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './categoryBranch.module.css';

const Branch = props => {
    const { category, setCategoryId, isTopLevel, onNavigate } = props;
    const { name } = category;
    const classes = useStyle(defaultClasses, props.classes);

    const { handleClick: handleItemClick } = useCategoryLeaf({ onNavigate });

    const { exclude, handleClick } = useCategoryBranch({ category, setCategoryId });

    if (exclude) {
        return null;
    }

    const subMenuProperties = category?.menu_items || [];

    const subMenu = subMenuProperties.map(({ frontend_label, store_label, items, url_page }) => {
        if (items.length === 0) return;
        return (
            <Section
                key={url_page}
                classes={{
                    root: classes.sectionRoot,
                    title: classes.sectionTitle,
                    title_wrapper: classes.sectionTitleWrapper
                }}
                id={frontend_label}
                title={store_label}
            >
                <div className={classes.sectionAttributeList}>
                    {items.map(({ option_setting_id, label, url_alias }) => {
                        return (
                            <Link
                                key={option_setting_id}
                                className={classes.attributeLink}
                                to={`/${url_alias}`}
                                onClick={handleItemClick}
                            >
                                <span>{label}</span>
                            </Link>
                        );
                    })}
                    <Link className={classes.allLink} to={`/${url_page}`}>
                        <FormattedMessage id="submenu.seeAll" defaultMessage="See All" />{' '}
                    </Link>
                </div>
            </Section>
        );
    });

    const containerClass = isTopLevel ? classes.attributeListContainer : classes.attributeListContainer_visible;
    const buttonClass = isTopLevel ? classes.target : classes.target_hidden;

    return (
        <li className={classes.root}>
            <button className={buttonClass} data-cy="CategoryTree-Branch-target" type="button" onClick={handleClick}>
                <span className={classes.text}>{name}</span>
            </button>
            <div className={containerClass}>
                <Accordion canOpenMultiple={false} noScrollIntoView={true}>
                    {subMenu}
                </Accordion>
            </div>
        </li>
    );
};

export default Branch;

Branch.propTypes = {
    category: shape({
        uid: string.isRequired,
        include_in_menu: number,
        name: string.isRequired
    }).isRequired,
    classes: shape({
        root: string,
        target: string,
        text: string
    }),
    setCategoryId: func.isRequired
};
