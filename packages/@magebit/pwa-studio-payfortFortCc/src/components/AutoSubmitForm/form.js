import React, { useEffect, useRef } from 'react';

/**
 *
 * @param actionUrl
 * @param params
 * @returns {JSX.Element}
 * @constructor
 */
const AutoSubmitForm = ({ actionUrl, params }) => {
    const formRef = useRef(null);
    useEffect(() => {
        formRef.current.submit();
    }, []);

    return (
        <form ref={formRef} method="POST" action={actionUrl}>
            {Object.keys(params).map(name => params[name] ? (
                <input key={name} type="hidden" name={name} value={params[name]}/>
            ) : null)}
        </form>
    );
};

export default AutoSubmitForm;
