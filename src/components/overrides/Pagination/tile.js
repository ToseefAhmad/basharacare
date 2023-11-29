import { bool, func, number, shape, string } from 'prop-types';
import React, { useCallback } from 'react';

import Button from '@app/components/overrides/Button';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './tile.module.css';

const Tile = props => {
    const { isActive, number, onClick } = props;
    const classes = useStyle(defaultClasses, props.classes);
    const rootClass = isActive ? classes.root_active : classes.root;
    const handleClick = useCallback(() => onClick(number), [onClick, number]);

    return (
        <Button
            classes={{
                root_normalPriority: rootClass
            }}
            onClick={handleClick}
            data-cy={isActive ? 'Tile-activeRoot' : 'Tile-root'}
        >
            {number}
        </Button>
    );
};

Tile.propTypes = {
    classes: shape({
        root: string,
        root_active: string
    }),
    isActive: bool,
    number: number,
    onClick: func
};

export default Tile;
