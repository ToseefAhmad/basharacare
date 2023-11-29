import { gql, useQuery } from '@apollo/client';
import { array, func, oneOfType, shape, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';
import ErrorView from '@magento/venia-ui/lib/components/ErrorView';

import Block from './block';
import defaultClasses from './cmsBlock.module.css';

const CmsBlockGroup = ({ identifiers, shimmer, classes: propClasses }) => {
    const classes = useStyle(defaultClasses, propClasses);

    const { loading, error, data } = useQuery(GET_CMS_BLOCKS, {
        variables: { identifiers },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first'
    });

    if (!data) {
        if (loading && shimmer) return shimmer;
        if (loading && !shimmer) return null;

        if (error) {
            return <ErrorView message={error.message} code="500" />;
        }
    }

    const { items } = data.cmsBlocks;

    if (!Array.isArray(items) || !items.length) {
        return (
            <div>
                <FormattedMessage id="cmsBlock.noBlocks" defaultMessage="There are no blocks to display" />
            </div>
        );
    }

    const BlockChild = typeof children === 'function' ? children : Block;
    const blocks = items.map((item, index) => (
        <BlockChild key={item.identifier} className={classes.block} index={index} {...item} />
    ));

    return (
        <div className={classes.root}>
            <div className={classes.content}>{blocks}</div>
        </div>
    );
};

CmsBlockGroup.propTypes = {
    children: func,
    classes: shape({
        block: string,
        content: string,
        root: string
    }),
    identifiers: oneOfType([string, array])
};

export default CmsBlockGroup;

export const GET_CMS_BLOCKS = gql`
    query cmsBlocks($identifiers: [String]!) {
        cmsBlocks(identifiers: $identifiers) {
            items {
                content
                identifier
            }
        }
    }
`;
