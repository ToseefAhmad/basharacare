import Breadcrumbs from '@amasty/blog-pro/src/components/Breadcrumbs/breadcrumbs';
import PostTags from '@amasty/blog-pro/src/components/PostTags';
import RelatedPosts from '@amasty/blog-pro/src/components/RelatedPosts';
import SocialButtons from '@amasty/blog-pro/src/components/SocialButtons';
import { BLOG_URLS_BY_SECTION } from '@amasty/blog-pro/src/constants';
import { useAmBlogProContext } from '@amasty/blog-pro/src/context';
import { usePost } from '@amasty/blog-pro/src/talons/usePost';
import { formatDate, getURL } from '@amasty/blog-pro/src/utils';
import React, { Fragment, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Redirect } from 'react-router-dom';

import RelatedProducts from '../RelatedProducts';
import RelatedProductsShimmer from '../RelatedProducts/relatedProducts.shimmer';

import { BrowserPersistence } from '@magento/peregrine/lib/util';
import { mergeClasses } from '@magento/venia-ui/lib/classify';
import { Title, Meta, Link } from '@magento/venia-ui/lib/components/Head';
import Image from '@magento/venia-ui/lib/components/Image';
import RichContent from '@magento/venia-ui/lib/components/RichContent';

import defaultClasses from './post.module.css';
import PostPageShimmer from './postPage.shimmer.js';

const DEFAULT_IMAGE_WIDTH = 640;
const DEFAULT_IMAGE_HEIGHT = 430;
const storage = new BrowserPersistence();

const PostPage = props => {
    const { settings } = useAmBlogProContext();

    const { relatedProductsLoading, relatedProducts, loading, error, post } = usePost();

    const [imageIsLoaded, setImageIsLoaded] = useState(false);

    if (loading) return <PostPageShimmer />;

    if (error) return <Redirect to="/404.html" />;

    if (!post) return null;

    if (!post.post_id) return <Redirect to="/404.html" />;

    const {
        url_key: postUrl,
        post_thumbnail: postThumbnail,
        post_thumbnail_alt: postThumbnailAlt,
        list_thumbnail: listThumbnail,
        tag_ids,
        title,
        full_content: fullContent,
        published_at: date,
        related_post_ids: relatedPostIds,
        meta_description,
        meta_tags,
        meta_title,
        hreflang_links,
        canonical_url
    } = post;

    const imgSrc = postThumbnail || listThumbnail;

    const classes = mergeClasses(defaultClasses, props.classes);
    const url = getURL(BLOG_URLS_BY_SECTION.POST, postUrl);
    const storeCode = storage.getItem('store_view_code') || STORE_VIEW_CODE;

    const { post_date_manner, post_image_width, post_image_height, social_enabled } = settings || {};

    const relatedProductsBlock = relatedProductsLoading ? (
        <RelatedProductsShimmer />
    ) : (
        <RelatedProducts products={relatedProducts} />
    );

    const postAltText = postThumbnailAlt ? postThumbnailAlt : title;

    const hreflangLinksElement = hreflang_links
        ? hreflang_links.map(({ href, hreflang }) => {
              return <Link key={hreflang} rel="alternate" href={href} hreflang={hreflang} />;
          })
        : null;

    const canonicalUrl = `${origin}/${storeCode}${canonical_url}`;
    const canonicalUrlElement = canonical_url ? <Link rel="canonical" href={canonicalUrl} /> : null;

    return (
        <Fragment>
            <Title>{meta_title || title}</Title>
            <Meta name="description" content={meta_description} />
            <Meta name="tags" content={meta_tags} />
            {canonicalUrlElement}
            {hreflangLinksElement}
            <Breadcrumbs
                pageTitle={title}
                postPage="true"
                classes={{
                    gridArea: classes.breadcrumbs,
                    root: classes.postBreadcrumbs
                }}
            />

            <div className={classes.main}>
                <PostTags tagIds={tag_ids} classes={{ tags: classes.postTags }} />

                <h1 className={classes.postTitle}>{title}</h1>

                <div className={classes.postDate}>{formatDate(date, post_date_manner)}</div>

                {imgSrc && (
                    <div className={classes.postImages}>
                        <Image
                            alt={postAltText}
                            classes={{
                                image: classes.postImage,
                                root: imageIsLoaded ? classes.postImageContainer : classes.imageContainerShimmer,
                                placeholder_layoutOnly: classes.postImagePlaceholder
                            }}
                            src={imgSrc}
                            onLoad={() => setImageIsLoaded(true)}
                            width={post_image_width || DEFAULT_IMAGE_WIDTH}
                            height={post_image_height || DEFAULT_IMAGE_HEIGHT}
                        />
                    </div>
                )}

                {social_enabled && (
                    <div className={classes.shareBlockTop}>
                        <div className={classes.shareTitle}>
                            <FormattedMessage id="blogPage.shareTitle" defaultMessage="Share:" />
                        </div>
                        <SocialButtons
                            title={meta_title}
                            description={meta_description}
                            url={url}
                            image={postThumbnail}
                        />
                    </div>
                )}

                <RichContent classes={{ root: classes.content }} html={fullContent} />

                {social_enabled && (
                    <div className={classes.shareBlockBottom}>
                        <div className={classes.shareTitle}>
                            <FormattedMessage id="blogPage.shareTitle" defaultMessage="Share:" />
                        </div>
                        <SocialButtons
                            title={meta_title}
                            description={meta_description}
                            url={url}
                            image={postThumbnail}
                        />
                    </div>
                )}

                {relatedProductsBlock}

                <RelatedPosts relatedPostIds={relatedPostIds} />
            </div>
        </Fragment>
    );
};

export default PostPage;
