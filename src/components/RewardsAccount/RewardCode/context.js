import React, { createContext, useContext } from 'react';

import { useRewardCode } from '@app/components/RewardsAccount/RewardCode/useRewardCode';

const RewardCodeContext = createContext(undefined);
const { Provider } = RewardCodeContext;

const RewardCodeProvider = props => {
    const talonProps = useRewardCode(props);

    const contextValue = {
        ...talonProps
    };

    return <Provider value={contextValue}>{props.children}</Provider>;
};

export default RewardCodeProvider;

export const useRewardCodeContext = () => useContext(RewardCodeContext);
