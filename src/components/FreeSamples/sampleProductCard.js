import React from 'react';
import { FormattedMessage } from 'react-intl';

import Button from '../overrides/Button';

import Image from '@magento/venia-ui/lib/components/Image';

import classes from './freeSamples.module.css';

const IMAGE_SIZE = 135;

const SampleProductCard = ({ name, item, url, disabled, handleAddToCart }) => {
    if (!name) return;

    return (
        <div
            onClick={() => !disabled && handleAddToCart(item)}
            onKeyDown={() => undefined}
            role="button"
            tabIndex={0}
            className={classes.sampleProductRoot}
        >
            <div className={classes.sampleInfoContainer}>
                <Image
                    alt={name}
                    classes={{
                        root: classes.imageRoot,
                        image: classes.image
                    }}
                    width={IMAGE_SIZE}
                    resource={url}
                />
                <div className={classes.sampleName}>{name}</div>
            </div>

            <Button
                classes={{ root_highPriority: classes.buttonRoot }}
                disabled={disabled}
                priority="high"
                onClick={handleAddToCart}
            >
                <FormattedMessage id="productFullDetail.addItemToCart" defaultMessage="Add to Cart" />
            </Button>
        </div>
    );
};

export default SampleProductCard;
