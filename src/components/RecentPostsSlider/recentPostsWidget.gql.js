import { gql } from '@apollo/client';

export const GET_RECENT_POSTS = gql`
    query amBlogRecentPostsWidget($id: Int) {
        amBlogRecentPostsWidget(id: $id) {
            header_text
            posts_limit
            show_images
            display_date
            date_manner
            display_short
            short_limit
            amasty_widget_categories
            amasty_widget_tags
            items {
                post_id
                title
                status
                url_key
                short_content
                created_at
                tags
                published_at
                post_thumbnail
                list_thumbnail
                post_thumbnail_alt
                list_thumbnail_alt
                author_id
                comment_count
            }
        }
    }
`;
