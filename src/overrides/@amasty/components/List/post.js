import defaultClasses from '@amasty/blog-pro/src/components/PostPage/post.module.css';
import PostTags from '@amasty/blog-pro/src/components/PostTags';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { formatDate, getURL } from '@amasty/blog-pro/src/utils';
import { shape, string } from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';

import { mergeClasses } from '@magento/venia-ui/lib/classify';
import Image from '@magento/venia-ui/lib/components/Image';
import RichText from '@magento/venia-ui/lib/components/RichText';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const IMAGE_WIDTH = 640;
const IMAGE_HEIGHT = 430;

const Post = props => {
    const { post } = props;
    const {
        url_key,
        post_thumbnail: postThumbnail,
        list_thumbnail: listThumbnail,
        post_thumbnail_alt: postThumbnailAlt,
        tag_ids,
        title,
        meta_description: metaDescription,
        published_at: date
    } = post;

    const { settings } = useAmBlogProContext();

    const [imageIsLoaded, setImageIsLoaded] = useState(false);

    const classes = mergeClasses(defaultClasses, props.classes);
    const url = getURL(BLOG_URLS_BY_SECTION.POST, url_key);
    const imgSrc = listThumbnail || postThumbnail;

    const { post_date_manner, post_image_width, post_image_height } = settings || {};

    const shortText = text => {
        if (!text) return null;

        if (text.length > 80) {
            return text.substring(0, 80) + '...';
        }

        return text;
    };

    const postAltText = postThumbnailAlt ? postThumbnailAlt : title;

    return (
        <div className={classes.root}>
            {imgSrc ? (
                <Link to={url} className={classes.images}>
                    <Image
                        alt={postAltText}
                        classes={{
                            image: classes.image,
                            root: imageIsLoaded ? classes.imageContainer : classes.imageContainerShimmer
                        }}
                        src={imgSrc}
                        onLoad={() => setImageIsLoaded(true)}
                        width={post_image_width || IMAGE_WIDTH}
                        height={post_image_height || IMAGE_HEIGHT}
                    />
                </Link>
            ) : (
                <Shimmer width="100%" height={13.5} key="related.blogposts" />
            )}

            <PostTags tagIds={tag_ids} />

            <h3 className={classes.title}>
                <Link to={url} title={title}>
                    {title}
                </Link>
            </h3>

            <div className={classes.date}>{formatDate(date, post_date_manner)}</div>

            <RichText classes={{ root: classes.shortContent }} content={shortText(metaDescription)} />
            {metaDescription && metaDescription.length > 0 ? (
                <Link className={classes.more} to={url} title="Read more">
                    <FormattedMessage id="blogPage.readMore" defaultMessage="Read more" />
                </Link>
            ) : null}
        </div>
    );
};

Post.propTypes = {
    post: shape({
        url_key: string
    })
};

export default Post;
