import { getAdvanced } from '@magento/pagebuilder/lib/utils';

export default node => {
    return {
        ...getAdvanced(node)
    };
};
