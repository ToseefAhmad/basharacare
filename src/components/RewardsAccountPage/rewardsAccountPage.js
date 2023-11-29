import React from 'react';
import { useIntl } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import RewardsAccount from '@app/components/RewardsAccount';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

const RewardsAccountPage = () => {
    const { formatMessage } = useIntl();

    return (
        <AccountPageWrapper>
            <StoreTitle>
                {formatMessage({
                    id: 'RewardsPage.storeTitle',
                    defaultMessage: 'Reward Points'
                })}
            </StoreTitle>
            <RewardsAccount />
        </AccountPageWrapper>
    );
};
export default RewardsAccountPage;
