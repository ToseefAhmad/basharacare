import React, { Fragment } from 'react';
import { Link } from 'react-router-dom';

import { useSiteMapPage } from '@app/components/SiteMap/useSiteMapPage';
import { Meta, Title } from '@magento/venia-ui/lib/components/Head';

const SiteMapPage = () => {
    const { title, meta_description, items } = useSiteMapPage();

    const itemsElements = items.map(({ columns, key, title }) => {
        const columnsElement = columns.map((column, index) => {
            return (
                <ul key={`${column.length}-${index}`}>
                    {column.map((item, index) => {
                        switch (key) {
                            case 'categories':
                                return (
                                    <li key={item.url_key}>
                                        <Link to={item.url_key}>{item.name}</Link>
                                    </li>
                                );
                            case 'products':
                                return (
                                    <li key={item.name + index}>
                                        <Link to={item.url_key}>{item.name}</Link>
                                    </li>
                                );
                            case 'landing_pages':
                                return 'landing_pages';
                            case 'cms_pages':
                                return (
                                    <li key={item.url}>
                                        <Link to={item.url}>{item.title}</Link>
                                    </li>
                                );
                            case 'links':
                                return (
                                    <li key={item.url}>
                                        <a href={item.url}>{item.title}</a>
                                    </li>
                                );
                        }
                    })}
                </ul>
            );
        });
        if (columns.length) {
            return (
                <div key={key}>
                    <h3>{title}</h3>
                    <div className={`grid gap-4 grid-cols-${columns.length}`}>{columnsElement}</div>
                </div>
            );
        }
    });

    return (
        <Fragment>
            <Title>{title}</Title>
            <Meta name="title" content={title} />
            <Meta name="description" content={meta_description} />
            {itemsElements}
        </Fragment>
    );
};

export default SiteMapPage;
