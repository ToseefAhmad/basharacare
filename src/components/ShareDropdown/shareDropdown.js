import React from 'react';
import { Share2 } from 'react-feather';
import { FormattedMessage } from 'react-intl';

import { useShareDropdown } from '@app/components/ShareDropdown/useShareDropdown';

import classes from './shareDropdown.module.css';

const ShareDropdown = () => {
    const { addThisPubId, handleClick, appType } = useShareDropdown();

    const shareButton =
        addThisPubId || appType === 'ios' || appType === 'android' ? (
            <div className={classes.root}>
                <button type="button" className={classes.icon} onClick={handleClick}>
                    <div className={classes.shareText}>
                        <FormattedMessage id="productFullDetail.share" defaultMessage="Share" />
                    </div>
                    <Share2 />
                </button>
                {(!appType || appType === 'web') && (
                    <div className={classes.socialLinks}>
                        <div className="addthis_inline_share_toolbox" />
                    </div>
                )}
            </div>
        ) : null;

    return <div>{shareButton}</div>;
};

export default ShareDropdown;
