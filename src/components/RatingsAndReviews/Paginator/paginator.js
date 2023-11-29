import classNames from 'classnames';
import React from 'react';
import { ChevronLeft as ChevronLeftIcon, ChevronRight as ChevronRightIcon } from 'react-feather';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import defaultClasses from './paginator.module.css';
import PaginatorShimmer from './paginator.shimmer';

const Paginator = props => {
    const { showPaginator, paginatorArray, totalPages, currentPage, onPageChange, classes: propClasses } = props;
    const classes = useStyle(defaultClasses, propClasses);

    const chevronClasses = { root: classes.paginatorIcon, icon: classes.chevronIcon };

    if (!showPaginator || !totalPages || !currentPage) return null;

    if (!paginatorArray) return <PaginatorShimmer />;

    const pages = [...paginatorArray].map(({ value, label }, index) => {
        return (
            <button
                onClick={() => onPageChange(value)}
                key={`${value}_${label}_${index}`}
                className={classNames(classes.paginatorNumber, {
                    [classes.active]: value === currentPage,
                    [classes.inactive]: value !== currentPage
                })}
            >
                {label}
            </button>
        );
    });

    return (
        <div className={classes.paginatorBlock}>
            <div className={classes.paginator}>
                {currentPage >= 2 ? (
                    <button onClick={() => onPageChange(currentPage - 1)}>
                        <Icon src={ChevronLeftIcon} classes={chevronClasses} size={20} />
                    </button>
                ) : null}
                {pages}
                {currentPage <= totalPages - 1 ? (
                    <button onClick={() => onPageChange(currentPage + 1)}>
                        <Icon src={ChevronRightIcon} classes={chevronClasses} size={20} />
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default Paginator;
