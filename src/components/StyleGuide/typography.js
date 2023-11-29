import classnames from 'classnames';
import React from 'react';

import classes from './typography.module.css';

const Typography = () => (
    <div className={classes.root}>
        <div className={classes.textBlock}>
            <h1>Desktop/ Title H1</h1>
            <h1 className={classes.headingRegular}>Desktop/ Title H1</h1>
        </div>
        <div className={classes.textBlock}>
            <h2>Desktop/ Title H2</h2>
            <h2 className={classes.headingRegular}>Desktop/ Title H2</h2>
        </div>
        <div className={classes.textBlockSmall}>
            <h3>Desktop/ Title H3</h3>
        </div>
        <div className={classes.textBlockSmall}>
            <h4>Desktop/ Title H4</h4>
        </div>
        <h5>Desktop/ Title H5</h5>

        <div className={classes.paragraphs}>
            <div className={classes.paragraph}>
                <p className={classes.label}>Text 24px Regular</p>
                <p className={classes.pLarge}>
                    A gentle face wash that cleanses and nurtures without over-drying for clean skin that looks fresh.
                </p>
            </div>
            <div className={classes.paragraph}>
                <p className={classes.label}>Text 16px Bold</p>
                <p className={classes.pBold}>
                    The safest, most effective formulas in simple routines that bring remarkable results.
                </p>
            </div>
            <div className={classes.paragraph}>
                <p className={classes.label}>Text 16px</p>
                <p>The safest, most effective formulas in simple routines that bring remarkable results.</p>
            </div>
        </div>

        <div className={classes.buttons}>
            <div className={classes.button}>
                <p className={classes.label}>Text for Buttons 20px</p>
                <span className={classnames(classes.btnLarge, classes.btnUpper)}>Shop Now</span>
            </div>
            <div className={classes.button}>
                <p className={classes.label}>Text for Buttons 16px</p>
                <span className={classes.btnUpper}>Continue to payment method</span>
            </div>
            <div className={classes.button}>
                <p className={classes.label}>Text for Buttons 14px</p>
                <span className={classnames(classes.btnUpper, classes.btnSmall)}>Shop Now</span>
            </div>
            <div className={classes.button}>
                <p className={classes.label}>Text for Buttons 14px</p>
                <span className={classes.btnSmall}>Explore</span>
            </div>
        </div>

        <div className={classes.links}>
            <p className={classes.label}>Links</p>
            <div className={classes.linkRows}>
                <div className={classes.linkCol}>
                    <span href="#." className={classnames(classes.greyLabel, classes.linkRow)}>
                        Not active
                    </span>
                    <span href="#." className={classes.greyLabel}>
                        Active
                    </span>
                </div>
                <div className={classnames(classes.linkCol, classes.linkBold)}>
                    <a href="#." className={classes.linkRow}>
                        Face Care
                    </a>
                    <a href="#." className={classes.hover}>
                        Face Care
                    </a>
                </div>
                <div className={classnames(classes.linkCol, classes.link)}>
                    <a href="#." className={classes.linkRow}>
                        Fine Lines & Wrinkles
                    </a>
                    <a href="#." className={classes.hover}>
                        Fine Lines & Wrinkles
                    </a>
                </div>
                <div className={classnames(classes.linkCol, classes.linkSmall, classes.linkBold)}>
                    <a href="#." className={classnames(classes.linkRow, classes.hover)}>
                        See all
                    </a>
                    <a href="#.">See all</a>
                </div>
                <div className={classnames(classes.linkCol, classes.linkSmall)}>
                    <a href="#." className={classnames(classes.linkRow, classes.hover)}>
                        43 Reviews
                    </a>
                    <a href="#.">43 Reviews</a>
                </div>
            </div>
        </div>
    </div>
);

export default Typography;
