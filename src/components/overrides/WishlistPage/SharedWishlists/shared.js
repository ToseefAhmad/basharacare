import React from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';

import { useShared } from '@app/components/overrides/WishlistPage/SharedWishlists/useShared';
import { useStyle } from '@magento/venia-ui/lib/classify';
import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';

import defaultClasses from './shared.module.css';

const Shared = () => {
    const { sharingCode } = useParams();
    const classes = useStyle(defaultClasses);

    useShared({
        sharingCode
    });

    return (
        <LoadingIndicator classes={{ root: classes.loading }}>
            <FormattedMessage id="sharedWishlists.loading" defaultMessage="Fetching Added Products With Email..." />
        </LoadingIndicator>
    );
};
export default Shared;
