import { gql } from '@apollo/client';

export const RESOLVE_URL = gql`
    query ResolveURL($url: String!) {
        route(url: $url) {
            relative_url
            redirect_code
            type
            ... on CmsPage {
                identifier
            }
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on ProductInterface {
                uid
                __typename
            }
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on CategoryInterface {
                uid
            }
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on ShopByAttributeInterface {
                url_page
                __typename
            }
            # eslint-disable-next-line @graphql-eslint/require-id-when-available
            ... on ShopByAttributeOptionInterface {
                option_id
                description
                filter_code
                url_alias
                meta_title
                meta_description
                meta_keywords
                value
                image
                top_cms_block_identifier
                bottom_cms_block_identifier
                is_new_arrivals
                __typename
            }
        }
    }
`;

export default {
    resolveUrlQuery: RESOLVE_URL
};
