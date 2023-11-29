import React from 'react';

import {
    AuthorizedRetailer,
    Box,
    ChevronDown,
    ChevronRight,
    ChevronUp,
    Gift,
    HairCare,
    Hamburger,
    HandCare,
    Heart,
    HeartEmpty,
    Instagram,
    Share,
    SkinCare,
    Sort,
    Star,
    Stars,
    SunCare
} from '@app/components/Icons';
import RatingStars from '@app/components/RatingStars/ratingStars';

import classes from './icons.module.css';

const Icons = () => (
    <div className={classes.root}>
        <div className={classes.blackBox}>
            <Gift />
            <Box />
            <Star />
        </div>
        <div className={classes.displayBox}>
            <Stars />
            <SkinCare />
            <SunCare />
            <Star fill="black" width={36.5} height={35.1} />
            <Heart />
            <HairCare />
            <Instagram />
            <HandCare />
        </div>
        <div className={classes.starDisplayBox}>
            <div className={classes.stars}>
                <RatingStars
                    maxCount={5}
                    current={4}
                    classes={{
                        active: classes.starBrownActive,
                        inactive: classes.starBrownInactive
                    }}
                    width={13.1}
                    height={12.77}
                />
                <RatingStars
                    maxCount={5}
                    current={4}
                    classes={{
                        active: classes.starBlueActive,
                        inactive: classes.starBlueInactive
                    }}
                    width={13.1}
                    height={12.77}
                />
                <RatingStars
                    maxCount={5}
                    current={4}
                    classes={{
                        active: classes.starPurpleActive,
                        inactive: classes.starPurpleInactive
                    }}
                    width={13.1}
                    height={12.77}
                />
                <RatingStars
                    maxCount={5}
                    current={5}
                    classes={{
                        active: classes.starBlack,
                        inactive: classes.starPurpleInactive
                    }}
                    width={11.121}
                    height={10.66}
                />
            </div>
            <div className={classes.actionIcons}>
                <Sort />
                <Hamburger />
                <Share />
                <ChevronUp />
                <ChevronDown />
                <HeartEmpty />
                <ChevronRight />
            </div>
        </div>
        <AuthorizedRetailer />
    </div>
);

export default Icons;
