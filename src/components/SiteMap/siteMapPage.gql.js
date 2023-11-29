import { gql } from '@apollo/client';

export const GET_SITE_MAP_DATA = gql`
    query getSitemap {
        storeConfig {
            store_code
            amseohtmlsitemap_title
            amseohtmlsitemap_meta_description
        }
        sitemap {
            categories
            products
            landing_pages
            cms_pages
            links
        }
    }
`;

export default {
    getSitemap: GET_SITE_MAP_DATA
};
