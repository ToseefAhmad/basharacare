import { gql } from '@apollo/client';

export const GET_CMS_PAGE = gql`
    query GetCmsPage($identifier: String!) {
        cmsPage(identifier: $identifier) {
            url_key
            content
            content_heading
            title
            page_layout
            canonical_url
            meta_title
            meta_keywords
            meta_description
            hreflang_links {
                href
                hreflang
            }
            rich_data {
                product
                breadcrumbs
                category
                organization
                website
            }
            open_graph {
                type
                url
                is_show
                title
                description
                site_name
            }
        }
    }
`;

export default {
    getCMSPageQuery: GET_CMS_PAGE
};
