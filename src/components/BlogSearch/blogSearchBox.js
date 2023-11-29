import { func } from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';

import SearchBox from '@app/components/SearchBox';

import classes from './blogSearch.module.css';

const BlogSearchBox = ({ setIsSearchOpen }) => {
    const { formatMessage } = useIntl();
    return (
        <SearchBox
            allowSearchPage={false}
            classes={{
                root: classes.searchBoxRoot,
                input: classes.input,
                icon: classes.icon
            }}
            canReset={true}
            placeholder={formatMessage({
                id: 'blogSearchBox.placeholder',
                defaultMessage: 'Search'
            })}
            openSearch={setIsSearchOpen}
        />
    );
};

BlogSearchBox.propTypes = {
    setIsSearchOpen: func
};

export default BlogSearchBox;
