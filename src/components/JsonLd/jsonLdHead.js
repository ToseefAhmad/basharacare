import React from 'react';

const JsonLd = ({ data }) => {
    return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: data }} />;
};

export default JsonLd;
