import defaultClasses from '@amasty/blog-pro/src/components/FeaturedPosts/featuredPosts.module.css';
import PostTags from '@amasty/blog-pro/src/components/PostTags';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { getURL, formatDate } from '@amasty/blog-pro/src/utils';
import { string } from 'prop-types';
import React from 'react';
import { Link } from 'react-router-dom';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import RichText from '@magento/venia-ui/lib/components/RichText';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const IMAGE_WIDTH = 400;
const IMAGE_HEIGHT = 270;

const Post = props => {
    const { settings } = useAmBlogProContext();

    const {
        url_key,
        post_thumbnail: postThumbnail,
        list_thumbnail: listThumbnail,
        post_thumbnail_alt: postThumbnailAlt,
        title,
        tag_ids,
        published_at: date,
        meta_description: metaDescription
    } = props;

    const classes = mergeClasses(defaultClasses, props.classes);
    const url = getURL(BLOG_URLS_BY_SECTION.POST, url_key);
    const imgSrc = listThumbnail || postThumbnail;
    const { post_image_width, post_image_height } = settings || {};

    const imgWidth = post_image_width || IMAGE_WIDTH;
    const imgHeight = post_image_height || IMAGE_HEIGHT;

    const imgContainerStyle = {
        paddingTop: `${(imgHeight / imgWidth) * 100}%`
    };

    const shortText = text => {
        if (!text) return null;

        if (text.length > 80) {
            return text.substring(0, 80) + '...';
        }

        return text;
    };

    return (
        <div className={classes.post}>
            <Link className={classes.images} to={url} title={title} style={imgContainerStyle}>
                {imgSrc ? (
                    <Image
                        alt={postThumbnailAlt}
                        classes={{
                            image: classes.image,
                            root: classes.imageContainer,
                            placeholder_layoutOnly: classes.imagePlaceholder
                        }}
                        resource={imgSrc}
                        width={imgWidth}
                        height={imgWidth}
                    />
                ) : (
                    <Shimmer width="100%" height={13.5} key="related.blogposts" />
                )}
            </Link>

            <PostTags tagIds={tag_ids} />

            <Link to={url} title={title}>
                <h3 className={classes.postTitle}>{title}</h3>
            </Link>

            <div className={classes.date}>{formatDate(date)}</div>

            <RichText classes={{ root: classes.shortContent }} content={shortText(metaDescription)} />

            <Link className={classes.more} to={url} title="Read more">
                <span>Read more</span>
            </Link>
        </div>
    );
};

Post.propTypes = {
    url_key: string,
    post_thumbnail: string,
    list_thumbnail: string,
    post_thumbnail_alt: string,
    title: string
};

export default Post;
