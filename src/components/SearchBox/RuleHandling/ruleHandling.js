import { func } from 'prop-types';
import React from 'react';
import { QueryRuleCustomData } from 'react-instantsearch-dom';

const RuleHandling = ({ setRedirect }) => {
    return (
        <QueryRuleCustomData
            transformItems={items => {
                const match = items.find(data => Boolean(data.redirect));
                if (match && match.redirect) {
                    setRedirect(match.redirect);
                }
                return [];
            }}
        >
            {() => null}
        </QueryRuleCustomData>
    );
};

RuleHandling.propTypes = {
    setRedirect: func
};

export default RuleHandling;
