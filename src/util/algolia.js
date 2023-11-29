import { BrowserPersistence } from '@magento/peregrine/lib/util';

const storage = new BrowserPersistence();

const ProductTypes = {
    simple: 'SimpleProduct',
    configurable: 'ConfigurableProduct'
};

const getUrlKeyFromPath = pathname => {
    const storeCode = storage.getItem('store_view_code');

    if (pathname.includes(`${storeCode}/`)) {
        return pathname.replace(`/${storeCode}/`, '');
    }

    return pathname.replace('/', '');
};

export const transformHitToProduct = hit => {
    const currency = Object.keys(hit.price)[0];
    const price = hit.price[currency];

    return {
        id: parseInt(hit.objectID),
        sku: hit.sku,
        __typename: ProductTypes[hit.type_id] || hit.type_id,
        name: hit.name,
        brand_name: hit.brand,
        brand_url: hit.brand_url,
        category_name: hit.categories.level0 ? hit.categories.level0[0] : null,
        small_image: {
            url: hit.image_url
        },
        rating_summary: hit.rating_summary,
        url_key: `${hit.url_key || getUrlKeyFromPath(new URL(hit.url).pathname)}${
            hit.__queryID ? `?queryID=${hit.__queryID}` : ''
        }`,
        price_range: {
            maximum_price: {
                regular_price: {
                    value: price.default_original || price.default,
                    currency
                },
                final_price: {
                    value: price.default,
                    currency
                }
            }
        },
        stock_status: hit.in_stock ? 'IN_STOCK' : 'OUT_OF_STOCK'
    };
};

export const transformHitToBlog = hit => {
    return {
        url_key: hit.url_key,
        post_thumbnail: hit.image_url,
        tag_ids: hit.tag_ids,
        title: hit.title,
        meta_description: hit.meta_description,
        published_at: hit.published_at
    };
};
