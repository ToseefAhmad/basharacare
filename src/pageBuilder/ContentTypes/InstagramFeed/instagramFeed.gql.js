import { gql } from '@apollo/client';

export const GET_INSTAGRAM_FEED = gql`
    query getInstagramFeed($sort: String!, $postLimit: String!) {
        instagramFeed(sort: $sort, postLimit: $postLimit) {
            posts {
                media_url
                post_id
                caption
                permalink
            }
        }
    }
`;

export default {
    getInstagramFeed: GET_INSTAGRAM_FEED
};
