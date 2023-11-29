import { useQuery } from '@apollo/client';
import { bool, number, string } from 'prop-types';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import SlickSlider from 'react-slick';

import { ChevronRight, LeftArrow, RightArrow, Stars } from '@app/components/Icons';
import Post from '@app/components/RecentPostsSlider/post';
import { getDirection } from '@app/hooks/useDirection';
import Icon from '@magento/venia-ui/lib/components/Icon';

import classes from './recentPostsSlider.module.css';
import { GET_RECENT_POSTS } from './recentPostsWidget.gql';

const RecentPostsSlider = props => {
    const { widgetId, title } = props;

    const { loading, error, data } = useQuery(GET_RECENT_POSTS, {
        fetchPolicy: 'cache-and-network',
        variables: {
            id: widgetId
        }
    });

    const { amBlogRecentPostsWidget } = data || {};
    const { header_text, items } = amBlogRecentPostsWidget || {};
    const widgetTitle = header_text || title;
    const primaryTitle = widgetTitle.split(' ').shift();
    const secondaryTitle = widgetTitle
        .split(' ')
        .slice(1)
        .join(' ');

    if (loading || error) {
        return null;
    }

    if (!items || !items.length) {
        return <div>Posts were not found</div>;
    }

    const posts = items.map(item => <Post key={item.post_id} {...item} {...amBlogRecentPostsWidget} />);

    const exploreButton = (
        <Link className={classes.exploreButton} to="/blog">
            <span className={classes.exploreButtonTitle}>
                <FormattedMessage id="recentPostSlider.exploreButtonTitle" defaultMessage="Blog" />
            </span>
            <span>
                <FormattedMessage id="recentPostSlider.readMoreButtonText" defaultMessage="Read more" />
            </span>
            <ChevronRight />
        </Link>
    );

    const settings = {
        slidesToShow: 3,
        slidesToScroll: 1,
        dotsClass: 'slick-line',
        dots: true,
        swipeToSlide: true,
        arrows: true,
        draggable: true,
        centerMode: true,
        infinite: true,
        lazyLoad: true,
        prevArrow: <Icon src={LeftArrow} />,
        nextArrow: <Icon src={RightArrow} />,
        dir: getDirection(),
        responsive: [
            {
                breakpoint: 1024,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    draggable: true,
                    arrows: true,
                    centerMode: true,
                    dots: true,
                    infinite: true
                }
            },
            {
                breakpoint: 640,
                settings: {
                    slidesToShow: 2,
                    slidesToScroll: 1,
                    draggable: true,
                    arrows: true,
                    centerMode: true,
                    infinite: true,
                    dots: true
                }
            },
            {
                breakpoint: 500,
                settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                    centerPadding: '60px',
                    className: 'center',
                    draggable: true,
                    arrows: false,
                    centerMode: true,
                    infinite: true,
                    dots: true
                }
            }
        ]
    };
    return (
        <div className={classes.root}>
            <div className={classes.contentWrapper}>
                <div className={classes.headerWrapper}>
                    <div className={classes.title}>
                        <span>{primaryTitle}</span>
                        <span className={classes.secondaryTitle}>{secondaryTitle}</span>
                        <Stars width={40} height={41} />
                    </div>
                    {exploreButton}
                </div>
                <SlickSlider {...settings}>{posts}</SlickSlider>
            </div>
            <div className={classes.mobileExploreButtonWrapper}>{exploreButton}</div>
        </div>
    );
};

RecentPostsSlider.propTypes = {
    widgetId: number,
    title: string,
    accordionEnabled: bool
};

RecentPostsSlider.defaultProps = {
    widgetId: 0,
    title: 'Recent posts',
    accordionEnabled: false,
    prevArrow: <Icon src={LeftArrow} />,
    nextArrow: <Icon src={RightArrow} />
};

export default RecentPostsSlider;
