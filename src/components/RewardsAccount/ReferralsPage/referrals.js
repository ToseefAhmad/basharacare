import React from 'react';
import { useIntl } from 'react-intl';

import AccountPageWrapper from '@app/components/AccountPageWrapper';
import Forms from '@app/components/RewardsAccount/forms';
import ReferralsTable from '@app/components/RewardsAccount/ReferralsPage/referralsTable';
import { StoreTitle } from '@magento/venia-ui/lib/components/Head';

const ReferralsAccountPage = () => {
    const { formatMessage } = useIntl();
    return (
        <AccountPageWrapper>
            <StoreTitle>
                {formatMessage({
                    id: 'referralsPage.storeTitle',
                    defaultMessage: 'My Referrals'
                })}
            </StoreTitle>
            <Forms>
                <ReferralsTable />
            </Forms>
        </AccountPageWrapper>
    );
};
export default ReferralsAccountPage;
