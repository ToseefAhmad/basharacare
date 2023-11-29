import { getAdvanced } from '@magento/pagebuilder/lib/utils';

export default node => {
    const itemHeader = node.childNodes[0].textContent;
    const itemContent = node.childNodes[1].innerHTML;

    return {
        header: itemHeader,
        content: itemContent,
        ...getAdvanced(node)
    };
};
