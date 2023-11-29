import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { getStrippedText, formatDate, getURL } from '@amasty/blog-pro/src/utils';
import { bool, number, string } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import PostTags from '@app/overrides/@amasty/components/PostTags';
import Image from '@magento/venia-ui/lib/components/Image';
import RichText from '@magento/venia-ui/lib/components/RichText';

import classes from './post.module.css';

const IMAGE_WIDTH = 330;
const IMAGE_HEIGHT = 217;

const Post = props => {
    const {
        show_images: showImages,
        display_date: displayDate,
        date_manner: dateManner,
        display_short: displayShort,
        short_limit: shortLimit,
        url_key,
        post_thumbnail: postThumbnail,
        list_thumbnail: listThumbnail,
        post_thumbnail_alt: postThumbnailAlt,
        short_content: shortContent,
        published_at: date,
        title,
        tags
    } = props;

    const { settings } = useAmBlogProContext();
    const { recent_posts_image_width, recent_posts_image_height } = settings || {};

    const url = getURL(BLOG_URLS_BY_SECTION.POST, url_key);
    const imgSrc = postThumbnail || listThumbnail;

    const tagsCount = tags.split(',').length - 1;

    const tagsWrapperClasses = tagsCount >= 2 ? classes.postTagsRootAnimated : classes.postTagsRoot;
    const postAltText = postThumbnailAlt ? postThumbnailAlt : title;
    return (
        <div className={classes.postRoot}>
            {showImages && imgSrc && (
                <Link to={url} className={classes.images}>
                    <Image
                        alt={postAltText}
                        classes={{
                            image: classes.image,
                            root: classes.imageContainer
                        }}
                        resource={imgSrc}
                        width={IMAGE_WIDTH || recent_posts_image_width}
                        height={IMAGE_HEIGHT || recent_posts_image_height}
                    />
                </Link>
            )}

            <PostTags classes={{ tagsContainer: tagsWrapperClasses }} tagIds={tags} />

            <div className={classes.postContent}>
                <div className={classes.postTitle}>
                    <Link to={url} title={title}>
                        <span>{title}</span>
                    </Link>
                </div>

                {displayShort && (
                    <RichText
                        classes={{ root: classes.shortContent }}
                        content={getStrippedText(shortContent, shortLimit)}
                    />
                )}

                {displayDate && <div className={classes.date}>{formatDate(date, dateManner)}</div>}
            </div>
        </div>
    );
};

Post.propTypes = {
    title: string,
    url_key: string,
    show_images: bool,
    display_date: bool,
    date_manner: string,
    display_short: bool,
    short_limit: number,
    post_thumbnail: string,
    list_thumbnail: string,
    post_thumbnail_alt: string,
    short_content: string,
    published_at: string
};

export default Post;
