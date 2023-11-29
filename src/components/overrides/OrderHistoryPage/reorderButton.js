import { string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useOrderHistoryPage } from './useOrderHistoryPage';

const ReorderButton = ({ orderNumber }) => {
    const { handleReorderItems } = useOrderHistoryPage({ orderNumber });

    return (
        <button onClick={handleReorderItems}>
            <span>
                <FormattedMessage id="orderHistoryPage.reorderButton" defaultMessage="Reorder" />
            </span>
        </button>
    );
};
export default ReorderButton;

ReorderButton.propTypes = {
    orderNumber: string
};
