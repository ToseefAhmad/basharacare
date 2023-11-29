import { shape, string } from 'prop-types';
import React from 'react';

import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import Image from '@magento/venia-ui/lib/components/Image';
import Shimmer from '@magento/venia-ui/lib/components/Shimmer';

const GalleryItemShimmer = ({ classes }) => {
    return (
        <div className={classes.shimmerRoot} aria-live="polite" aria-busy="true">
            <section className={classes.reviews}>
                <Shimmer key="ŗelated-products-reviews" width={5} height={2} />
            </section>
            <section>
                <div className={classes.imageRoot}>
                    <Image
                        alt="Placeholder for gallery item image"
                        classes={{
                            image: classes.image,
                            root: classes.imageContainer
                        }}
                        src={transparentPlaceholder}
                    />
                </div>
            </section>
            <section>
                <div className={classes.brand}>
                    <Shimmer key="ŗelated-products-brand" width={3} height={1} />
                </div>
            </section>
            <section>
                <div className={classes.name}>
                    <Shimmer key="ŗelated-products-name" width={10} height={6} />
                </div>
            </section>
            <section>
                <div className={classes.price}>
                    <Shimmer key="ŗelated-products-price" width={2} height={3} />
                </div>
            </section>
        </div>
    );
};

GalleryItemShimmer.propTypes = {
    classes: shape({
        root: string
    })
};

export default GalleryItemShimmer;
