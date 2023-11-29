import { func, number, shape, string } from 'prop-types';
import React, { useMemo } from 'react';

import CircleButton from '@app/components/CircleButton/circleButton';
import { ArrowShort } from '@app/components/Icons';
import { usePagination } from '@magento/peregrine/lib/talons/Pagination/usePagination';
import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './pagination.module.css';
import Tile from './tile';

const Pagination = props => {
    const { currentPage, setPage, totalPages } = props.pageControl;
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = usePagination({
        currentPage,
        setPage,
        totalPages
    });

    const { handleNavBack, handleNavForward, tiles } = talonProps;

    const navigationTiles = useMemo(
        () =>
            tiles.map(tileNumber => {
                return (
                    <Tile
                        isActive={tileNumber === currentPage}
                        key={tileNumber}
                        number={tileNumber}
                        onClick={setPage}
                    />
                );
            }),
        [currentPage, tiles, setPage]
    );

    if (totalPages === 1) {
        return null;
    }

    return (
        <div className={classes.root} data-cy="Pagination-root">
            <div className={classes.buttonBack}>
                <CircleButton onClick={handleNavBack}>
                    <ArrowShort />
                </CircleButton>
            </div>

            <div className={classes.navTiles}>{navigationTiles}</div>
            <div className={classes.buttonForward}>
                <CircleButton onClick={handleNavForward}>
                    <ArrowShort />
                </CircleButton>
            </div>
        </div>
    );
};

Pagination.propTypes = {
    classes: shape({
        root: string
    }),
    pageControl: shape({
        currentPage: number,
        setPage: func,
        totalPages: number
    }).isRequired
};

export default Pagination;
