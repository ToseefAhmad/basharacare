import { useQuery } from '@apollo/client';
import React from 'react';

import Block from '@app/components/overrides/CmsBlock/block';
import { GET_CMS_BLOCKS } from '@app/components/overrides/CmsBlock/cmsBlock';

const PROMOTIONAL_BAR_IDENTIFIER = 'promotional-bar';

const PromotionalBar = () => {
    const { data } = useQuery(GET_CMS_BLOCKS, {
        variables: { identifiers: PROMOTIONAL_BAR_IDENTIFIER },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    if (!data) {
        return null;
    }

    const { items } = data.cmsBlocks;

    if (!Array.isArray(items) || !items.length) {
        return null;
    }

    const BlockChild = typeof children === 'function' ? children : Block;
    const blocks = items.map((item, index) => <BlockChild key={item.identifier} index={index} {...item} />);

    return <div className="block relative w-full">{blocks}</div>;
};

export default PromotionalBar;
