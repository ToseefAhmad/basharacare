import { func, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
const FormattedMessageDynamic = FormattedMessage;
import { Link } from 'react-router-dom';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './accountMenuItems.module.css';
import { useAccountMenuItems } from './useAccountMenuItems';

const AccountMenuItems = props => {
    const { onSignOut } = props;

    const talonProps = useAccountMenuItems({ onSignOut });
    const { handleSignOut, menuItems, rewardPoints, fullName } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const menu = menuItems.map(item => {
        return (
            <Link className={classes.link} key={item.name} to={item.url}>
                <FormattedMessageDynamic id={item.id} defaultMessage={item.name} />
            </Link>
        );
    });

    return (
        <div className={classes.root}>
            <div className={classes.rewardPoints}>
                <FormattedMessage
                    id="accountMenu.rewardsPoints"
                    defaultMessage="Reward Points: {rewardPoints}"
                    values={{
                        rewardPoints: rewardPoints || 0
                    }}
                />
            </div>
            <span className={classes.fullName}>{fullName}</span>
            <div className={classes.menuItems} data-cy="accountMenuItems-root">
                {menu}
                <button
                    className={classes.signOut}
                    onClick={handleSignOut}
                    type="button"
                    data-cy="accountMenuItems-signOut"
                >
                    <FormattedMessage id="accountMenu.signOutButtonText" defaultMessage="Sign Out" />
                </button>
            </div>
        </div>
    );
};

export default AccountMenuItems;

AccountMenuItems.propTypes = {
    classes: shape({
        link: string,
        signOut: string
    }),
    onSignOut: func
};
