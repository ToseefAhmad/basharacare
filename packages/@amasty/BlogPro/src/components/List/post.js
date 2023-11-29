import React from 'react';
import Image from '@magento/venia-ui/lib/components/Image';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import defaultClasses from '../PostPage/post.module.css';
import { Link } from 'react-router-dom';
import Features from '@amasty/blog-pro/src/components/Features';
import PostTags from '@amasty/blog-pro/src/components/PostTags';
import RichText from '@magento/venia-ui/lib/components/RichText';
import { formatDate, getURL } from '@amasty/blog-pro/src/utils';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { shape, string } from 'prop-types';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';

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
    short_content: shortContent,
    published_at: date
  } = post;

  const { settings } = useAmBlogProContext();

  const classes = mergeClasses(defaultClasses, props.classes);
  const url = getURL(BLOG_URLS_BY_SECTION.POST, url_key);
  const imgSrc = listThumbnail || postThumbnail;

  const { post_date_manner, post_image_width, post_image_height } =
    settings || {};

  return (
    <div className={classes.root}>
      {imgSrc && (
        <Link to={url} className={classes.images}>
          <Image
            alt={postThumbnailAlt}
            classes={{
              image: classes.image,
              root: classes.imageContainer
            }}
            src={imgSrc}
            width={post_image_width || IMAGE_WIDTH}
            height={post_image_height || IMAGE_HEIGHT}
          />
        </Link>
      )}

      <PostTags tagIds={tag_ids} />

      <Features post={post} postUrl={url} />

      <h2 className={classes.title}>
        <Link to={url} title={title}>
          {title}
        </Link>
      </h2>

      <div className={classes.date}>{formatDate(date, post_date_manner)}</div>

      <RichText classes={{ root: classes.content }} content={shortContent} />

      <div className={classes.footer}>
        <Link className={classes.more} to={url} title={'Read more'}>
          <span>Read more</span>
        </Link>
      </div>
    </div>
  );
};

Post.propTypes = {
  post: shape({
    url_key: string
  })
};

export default Post;
