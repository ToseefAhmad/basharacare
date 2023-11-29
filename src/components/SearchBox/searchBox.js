import { bool, func, shape, string } from 'prop-types';
import React, { useState } from 'react';
import { X } from 'react-feather';
import { connectSearchBox } from 'react-instantsearch-dom';
import { useIntl } from 'react-intl';

import { Search } from '../Icons';

import { useAppContext } from '@app/context/App';
import { useWindowSize } from '@magento/peregrine';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Icon from '@magento/venia-ui/lib/components/Icon';

import RuleHandling from './RuleHandling';
import defaultClasses from './searchBox.module.css';

const SearchBox = ({
    currentRefinement,
    refine,
    onSubmit,
    onReset,
    allowSearchPage,
    classes: propClasses,
    openSearch,
    placeholder,
    canReset
}) => {
    const [{ isSearchOpen }, { setIsSearchOpen }] = useAppContext();
    const classes = mergeClasses(defaultClasses, propClasses);
    const [redirectUrl, setRedirectUrl] = useState(null);
    const [value, setValue] = useState('');
    const { formatMessage } = useIntl();

    const isMobile = useWindowSize().innerWidth < 768;
    return (
        <>
            <form
                className={classes.root}
                onSubmit={e => {
                    e.preventDefault();
                    if (redirectUrl) {
                        globalThis.window.location.href = redirectUrl;
                        return;
                    }
                    if (onSubmit) {
                        onSubmit();
                    }
                }}
            >
                <label htmlFor="search-box">
                    <span className={classes.label}>
                        {formatMessage({
                            id: 'SearchBox.label',
                            defaultMessage: 'Search...'
                        })}
                    </span>
                    <input
                        className={classes.input}
                        id="search-box"
                        onBlur={() => {
                            if (!currentRefinement && allowSearchPage) {
                                setIsSearchOpen(false);
                            } else if (openSearch && !currentRefinement) {
                                openSearch(false);
                            }
                        }}
                        value={value}
                        placeholder={placeholder}
                        onChange={event => {
                            setValue(event.currentTarget.value);
                            if (event.currentTarget.value?.length >= 3 || isSearchOpen || !allowSearchPage) {
                                if (allowSearchPage) {
                                    setIsSearchOpen(!!event.currentTarget.value);
                                }
                                openSearch && openSearch(!!event.currentTarget.value);
                                refine(event.currentTarget.value);
                            }
                        }}
                    />
                </label>
                <div className={classes.icon}>
                    <Search width={isMobile ? 15 : 12} height={isMobile ? 15 : 12} />
                </div>
                {canReset && value && (
                    <button
                        type="button"
                        aria-label="Search"
                        className={classes.resetIcon}
                        onMouseDown={() => {
                            refine();
                            setValue('');
                            if (openSearch) {
                                openSearch(false);
                            }
                            if (allowSearchPage) {
                                setIsSearchOpen(false);
                            }
                            if (onReset) {
                                onReset();
                            }
                        }}
                    >
                        <Icon size={14} src={X} />
                    </button>
                )}
                <button type="submit" className={classes.hidden} />
            </form>
            <div className={classes.hidden}>
                <RuleHandling setRedirect={setRedirectUrl} />
            </div>
        </>
    );
};

SearchBox.defaultProps = {
    allowSearchPage: true
};

SearchBox.propTypes = {
    currentRefinement: string,
    refine: func,
    onSubmit: func,
    onReset: func,
    allowSearchPage: bool,
    placeholder: string,
    canReset: bool,
    classes: shape({
        root: string,
        icon: string,
        input: string,
        label: string,
        hidden: string,
        resetIcon: string
    })
};

export default connectSearchBox(SearchBox);
