import React from 'react';
import { FormattedMessage } from 'react-intl';

import { useFreeSamples } from '@app/components/FreeSamples/useFreeSamples';
import { Accordion, Section } from '@app/components/overrides/Accordion';

import classes from './freeSamples.module.css';
import SampleProductCard from './sampleProductCard';

const FreeSamples = () => {
    const { samples, canAdd, loading, handleAddToCart, limitReached } = useFreeSamples();
    const isEmpty = canAdd === 0;

    if (!samples) {
        return null;
    }

    let chooseSampleText = (
        <FormattedMessage
            id="freeSamples.add"
            defaultMessage="Add up to {count} free samples to your cart"
            values={{ count: canAdd }}
        />
    );

    if (canAdd === 0)
        chooseSampleText = (
            <FormattedMessage id="freeSamples.maximum" defaultMessage="Maximum amount of samples in the cart " />
        );

    const sectionClasses = {
        root: classes.sectionRoot,
        title_wrapper: classes.sectionTitleWrapper,
        title: classes.sectionTitle,
        contents_container: classes.sectionContents
    };

    const iconClasses = { root: classes.iconRoot };

    return (
        <div>
            {!isEmpty && (
                <Accordion noScrollIntoView classes={{ root: classes.accordionRoot }} canOpenMultiple={true}>
                    <Section
                        iconClasses={iconClasses}
                        classes={sectionClasses}
                        id="freeSamples"
                        title={chooseSampleText}
                    >
                        <div className={classes.root}>
                            {samples.map(item => {
                                const { url } = item.small_image;
                                return (
                                    <SampleProductCard
                                        handleAddToCart={handleAddToCart}
                                        limitReached={limitReached}
                                        item={item}
                                        key={item.name}
                                        name={item.name}
                                        url={url}
                                        disabled={loading || limitReached}
                                    />
                                );
                            })}
                        </div>
                    </Section>
                </Accordion>
            )}
            {isEmpty && (
                <div className={classes.accordionRoot}>
                    <span className={classes.sectionTitleWrapper}>
                        <span className={classes.sectionTitle}>{chooseSampleText}</span>
                    </span>
                    <div className={classes.sectionRoot} />
                </div>
            )}
        </div>
    );
};

export default FreeSamples;
