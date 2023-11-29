import { string } from 'prop-types';
import React, { Suspense } from 'react';

import LoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';

/**
 * @param content
 * @returns {JSX.Element}
 * @constructor
 */
const AccordionItem = ({ content }) => {
    return (
        <Suspense fallback={<LoadingIndicator />}>
            <RichContent html={content} />
        </Suspense>
    );
};

/**
 * @type {{content: Requireable<string>}}
 */
AccordionItem.propTypes = {
    content: string
};
export default AccordionItem;
