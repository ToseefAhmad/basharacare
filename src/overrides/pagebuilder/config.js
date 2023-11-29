import React from 'react';

import { AccordionShimmer } from '@app/pageBuilder/ContentTypes/Accordion';
import accordionConfigAggregator from '@app/pageBuilder/ContentTypes/Accordion/configAggregator';
import accordionItemConfigAggregator from '@app/pageBuilder/ContentTypes/AccordionItem/configAggregator';
import AmblockShimmer from '@app/pageBuilder/ContentTypes/AmblogWidget/amblock.shimmer';
import amBlogConfigAggregator from '@app/pageBuilder/ContentTypes/AmblogWidget/configAggregator';
import { BannerShimmer } from '@app/pageBuilder/ContentTypes/Banner';
import bannerConfigAggregator from '@app/pageBuilder/ContentTypes/Banner/configAggregator';
import { brandsSliderConfigAggregator } from '@app/pageBuilder/ContentTypes/BrandsSlider';
import BrandsSliderShimmer from '@app/pageBuilder/ContentTypes/BrandsSlider/brandsSlider.shimmer';
import imageConfigAggregator from '@app/pageBuilder/ContentTypes/Image/configAggregator';
import { instagramFeedConfigAggregator } from '@app/pageBuilder/ContentTypes/InstagramFeed';
import InstagramFeedShimmer from '@app/pageBuilder/ContentTypes/InstagramFeed/instagramFeed.shimmer';
import { mostWantedSliderConfigAggregator } from '@app/pageBuilder/ContentTypes/MostWantedSlider';
import MostWantedSliderShimmer from '@app/pageBuilder/ContentTypes/MostWantedSlider/mostWantedSlider.shimmer';
import { newArrivalsSliderConfigAggregator } from '@app/pageBuilder/ContentTypes/NewArrivalsSlider';
import NewArrivalsSliderShimmer from '@app/pageBuilder/ContentTypes/NewArrivalsSlider/newArrivalsSlider.shimmer';
import { productsConfigAggregator, ProductsShimmer } from '@app/pageBuilder/ContentTypes/Products';
import Row from '@app/pageBuilder/ContentTypes/Row';
import rowConfigAggregator from '@app/pageBuilder/ContentTypes/Row/configAggregator';
import { SliderShimmer } from '@app/pageBuilder/ContentTypes/Slider';
import sliderConfigAggregator from '@app/pageBuilder/ContentTypes/Slider/configAggregator';
import { trendingSliderConfigAggregator } from '@app/pageBuilder/ContentTypes/TrendingSlider';
import TrendingSliderShimmer from '@app/pageBuilder/ContentTypes/TrendingSlider/trendingSlider.shimmer';
import blockConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Block/configAggregator';
import ButtonItem from '@magento/pagebuilder/lib/ContentTypes/ButtonItem';
import buttonItemConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/ButtonItem/configAggregator';
import buttonsConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Buttons/configAggregator';
import Column from '@magento/pagebuilder/lib/ContentTypes/Column';
import columnConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Column/configAggregator';
import ColumnGroup from '@magento/pagebuilder/lib/ContentTypes/ColumnGroup';
import columnGroupConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/ColumnGroup/configAggregator';
import dividerConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Divider/configAggregator';
import Heading from '@magento/pagebuilder/lib/ContentTypes/Heading';
import headingConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Heading/configAggregator';
import htmlConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Html/configAggregator';
import mapConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Map/configAggregator';
import tabItemConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/TabItem/configAggregator';
import tabsConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Tabs/configAggregator';
import Text from '@magento/pagebuilder/lib/ContentTypes/Text';
import textConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Text/configAggregator';
import videoConfigAggregator from '@magento/pagebuilder/lib/ContentTypes/Video/configAggregator';

const contentTypesConfig = {
    // Default PageBuilder Content types
    column: {
        configAggregator: columnConfigAggregator,
        component: Column
    },
    'column-group': {
        configAggregator: columnGroupConfigAggregator,
        component: ColumnGroup
    },
    heading: {
        configAggregator: headingConfigAggregator,
        component: Heading
    },
    text: {
        configAggregator: textConfigAggregator,
        component: Text
    },
    tabs: {
        configAggregator: tabsConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Tabs'))
    },
    'tab-item': {
        configAggregator: tabItemConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/TabItem'))
    },
    buttons: {
        configAggregator: buttonsConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Buttons'))
    },
    'button-item': {
        configAggregator: buttonItemConfigAggregator,
        component: ButtonItem
    },
    block: {
        configAggregator: blockConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Block'))
    },
    html: {
        configAggregator: htmlConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Html'))
    },
    divider: {
        configAggregator: dividerConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Divider'))
    },
    video: {
        configAggregator: videoConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Video'))
    },
    map: {
        configAggregator: mapConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Map'))
    },
    banner: {
        configAggregator: bannerConfigAggregator,
        component: React.lazy(() => import('@magento/pagebuilder/lib/ContentTypes/Banner')),
        componentShimmer: BannerShimmer
    },

    // Magebit overrides
    row: {
        configAggregator: rowConfigAggregator,
        component: Row
    },
    slider: {
        configAggregator: sliderConfigAggregator,
        component: React.lazy(() => import('@app/pageBuilder/ContentTypes/Slider')),
        componentShimmer: SliderShimmer
    },
    slide: {
        configAggregator: bannerConfigAggregator,
        component: React.lazy(() => import('@app/pageBuilder/ContentTypes/Banner')),
        componentShimmer: BannerShimmer
    },
    accordion: {
        configAggregator: accordionConfigAggregator,
        component: React.lazy(() => import('@app/pageBuilder/ContentTypes/Accordion')),
        componentShimmer: AccordionShimmer
    },
    'accordion-item': {
        configAggregator: accordionItemConfigAggregator,
        component: React.lazy(() => import('@app/pageBuilder/ContentTypes/AccordionItem'))
    },
    magebit_mostwantedslider: {
        configAggregator: mostWantedSliderConfigAggregator,
        component: React.lazy(() => import('@app/pageBuilder/ContentTypes/MostWantedSlider')),
        componentShimmer: MostWantedSliderShimmer
    },
    brands_slider: {
        configAggregator: brandsSliderConfigAggregator,
        component: React.lazy(() => import('@app/pageBuilder/ContentTypes/BrandsSlider')),
        componentShimmer: BrandsSliderShimmer
    },
    magebit_newarrivals: {
        configAggregator: newArrivalsSliderConfigAggregator,
        component: React.lazy(() => import('@app/pageBuilder/ContentTypes/NewArrivalsSlider')),
        componentShimmer: NewArrivalsSliderShimmer
    },
    magebit_trendingslider: {
        configAggregator: trendingSliderConfigAggregator,
        component: React.lazy(() => import('@app/pageBuilder/ContentTypes/TrendingSlider')),
        componentShimmer: TrendingSliderShimmer
    },
    products: {
        configAggregator: productsConfigAggregator,
        component: React.lazy(() => import('@app/pageBuilder/ContentTypes/Products')),
        componentShimmer: ProductsShimmer
    },
    amblog_widget: {
        configAggregator: amBlogConfigAggregator,
        component: React.lazy(() => import('@app/pageBuilder/ContentTypes/AmblogWidget')),
        componentShimmer: AmblockShimmer
    },
    image: {
        configAggregator: imageConfigAggregator,
        component: React.lazy(() => import('@app/pageBuilder/ContentTypes/Image'))
    },
    magebit_instagramfeed: {
        configAggregator: instagramFeedConfigAggregator,
        component: React.lazy(() => import('@app/pageBuilder/ContentTypes/InstagramFeed')),
        componentShimmer: InstagramFeedShimmer
    }
};

/**
 * Retrieve a content types configuration
 *
 * @param {string} contentType
 * @returns {*}
 */
export const getContentTypeConfig = contentType => {
    if (contentTypesConfig[contentType]) {
        return contentTypesConfig[contentType];
    }
};

/**
 * Set content types configuration with new one
 *
 * @param {string} contentType
 * @param {*} config
 * @returns {*}
 */
export const setContentTypeConfig = (contentType, config) => {
    return (contentTypesConfig[contentType] = config);
};
