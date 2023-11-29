import classNames from 'classnames';
import { Form } from 'informed';
import React from 'react';

import CircleButton from '@app/components/CircleButton/circleButton';
import { ArrowShort, ChevronRight, Arrow } from '@app/components/Icons';
import Button from '@app/components/overrides/Button';
import Checkbox from '@app/components/overrides/Checkbox';
import LinkButton from '@app/components/overrides/LinkButton';

import classes from './buttons.module.css';

const Buttons = () => (
    <div className={classes.root}>
        <p className={classes.label}>Buttons</p>
        <div className={classes.container}>
            <div className={classes.labelsBox}>
                <span className={classes.stateLabel}>Not Active</span>
                <span className={classes.stateLabel}>Hover</span>
                <span className={classes.stateLabel}>Active</span>
            </div>
            <div className={classes.box}>
                <span className={classes.boxLabel}>Button 1</span>
                <Button
                    priority="banner"
                    classes={{
                        root_bannerPriority: classNames(classes.bannerBtn)
                    }}
                >
                    Shop Now
                </Button>
                <Button
                    priority="banner"
                    classes={{
                        root_bannerPriority: classes.bannerBtnHover
                    }}
                >
                    Shop Now
                </Button>
                <Button
                    priority="banner"
                    classes={{
                        root_bannerPriority: classes.bannerBtnActive
                    }}
                >
                    Shop Now
                </Button>
            </div>
            <div className={classes.box}>
                <span className={classes.boxLabel}>Button 3</span>
                <Button
                    priority="normal"
                    classes={{
                        root_normalPriority: classNames(classes.normalBtn)
                    }}
                >
                    <span>EXPLORE ALL</span>
                    <ChevronRight />
                </Button>
                <Button
                    priority="normal"
                    classes={{
                        root_normalPriority: classes.normalBtnActive
                    }}
                >
                    <span>EXPLORE ALL</span>
                    <ChevronRight />
                </Button>
                <Button
                    priority="normal"
                    classes={{
                        root_normalPriority: classes.normalBtnActive
                    }}
                >
                    <span>EXPLORE ALL</span>
                    <ChevronRight />
                </Button>
            </div>
            <div className={classes.box}>
                <span className={classes.boxLabel}>Button 5</span>
                <Button
                    priority="normal"
                    classes={{
                        root_normalPriority: classes.lowBtn
                    }}
                >
                    Add to cart
                </Button>
                <Button
                    priority="normal"
                    classes={{
                        root_normalPriority: classes.lowBtnHover
                    }}
                >
                    Add to cart
                </Button>
                <Button
                    priority="normal"
                    classes={{
                        root_normalPriority: classes.lowBtnActive
                    }}
                >
                    Add to cart
                </Button>
            </div>
            <div className={classes.box}>
                <span className={classes.boxLabel}>Arrow2</span>
                <CircleButton>
                    <ArrowShort />
                </CircleButton>
                <CircleButton
                    classes={{
                        root: classes.circleBtnHover
                    }}
                >
                    <ArrowShort />
                </CircleButton>
                <CircleButton
                    classes={{
                        root: classes.circleBtnActive
                    }}
                >
                    <ArrowShort />
                </CircleButton>
            </div>
            <div className={classes.box}>
                <span className={classes.boxLabel}>Button 6</span>
                <Button
                    priority="normal"
                    classes={{
                        root_normalPriority: classes.normalBtn
                    }}
                >
                    Show All
                </Button>
                <Button
                    priority="normal"
                    classes={{
                        root_normalPriority: classes.normalBtnActive
                    }}
                >
                    Show All
                </Button>
                <Button
                    priority="normal"
                    classes={{
                        root_normalPriority: classes.normalBtnActive
                    }}
                >
                    Show All
                </Button>
            </div>
            <div className={classes.box}>
                <Button priority="low" disabled={true}>
                    Shop Now
                </Button>
                <Button priority="normal">Shop Now</Button>
                <LinkButton>
                    <span>See all brands</span>
                    <Arrow />
                </LinkButton>
            </div>
        </div>
        <Form>
            <Checkbox field="test" label="Face Cream (33)" />
            <Checkbox field="test_2" label="Face Masks (43)" fieldValue={true} />
            <Checkbox field="test_2" label="Face Masks (43)" disabled={true} />
        </Form>
    </div>
);

export default Buttons;
