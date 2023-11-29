import React from 'react';

import AmblockShimmer from '@app/pageBuilder/ContentTypes/AmblogWidget/amblock.shimmer';
import amBlogConfigAggregator from '@app/pageBuilder/ContentTypes/AmblogWidget/configAggregator';
import { brandsSliderConfigAggregator } from '@app/pageBuilder/ContentTypes/BrandsSlider';
import BrandsSliderShimmer from '@app/pageBuilder/ContentTypes/BrandsSlider/brandsSlider.shimmer';
import { instagramFeedConfigAggregator } from '@app/pageBuilder/ContentTypes/InstagramFeed';
import InstagramFeedShimmer from '@app/pageBuilder/ContentTypes/InstagramFeed/instagramFeed.shimmer';
import { mostWantedSliderConfigAggregator } from '@app/pageBuilder/ContentTypes/MostWantedSlider';
import MostWantedSliderShimmer from '@app/pageBuilder/ContentTypes/MostWantedSlider/mostWantedSlider.shimmer';
import { newArrivalsSliderConfigAggregator } from '@app/pageBuilder/ContentTypes/NewArrivalsSlider';
import NewArrivalsSliderShimmer from '@app/pageBuilder/ContentTypes/NewArrivalsSlider/newArrivalsSlider.shimmer';
import { productsConfigAggregator, ProductsShimmer } from '@app/pageBuilder/ContentTypes/Products';
import { trendingSliderConfigAggregator } from '@app/pageBuilder/ContentTypes/TrendingSlider';
import TrendingSliderShimmer from '@app/pageBuilder/ContentTypes/TrendingSlider/trendingSlider.shimmer';

import { AccordionShimmer } from './ContentTypes/Accordion';
import accordionConfigAggregator from './ContentTypes/Accordion/configAggregator';
import accordionItemConfigAggregator from './ContentTypes/AccordionItem/configAggregator';
import { BannerShimmer } from './ContentTypes/Banner';
import bannerConfigAggregator from './ContentTypes/Banner/configAggregator';
import imageConfigAggregator from './ContentTypes/Image/configAggregator';
import Row from './ContentTypes/Row';
import rowConfigAggregator from './ContentTypes/Row/configAggregator';
import { SliderShimmer } from './ContentTypes/Slider';
import sliderConfigAggregator from './ContentTypes/Slider/configAggregator';

export const contentTypesConfig = {
    row: {
        configAggregator: rowConfigAggregator,
        component: Row
    },
    slider: {
        configAggregator: sliderConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Slider')),
        componentShimmer: SliderShimmer
    },
    slide: {
        configAggregator: bannerConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Banner')),
        componentShimmer: BannerShimmer
    },
    accordion: {
        configAggregator: accordionConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Accordion')),
        componentShimmer: AccordionShimmer
    },
    'accordion-item': {
        configAggregator: accordionItemConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/AccordionItem'))
    },
    magebit_mostwantedslider: {
        configAggregator: mostWantedSliderConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/MostWantedSlider')),
        componentShimmer: MostWantedSliderShimmer
    },
    brands_slider: {
        configAggregator: brandsSliderConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/BrandsSlider')),
        componentShimmer: BrandsSliderShimmer
    },
    magebit_newarrivals: {
        configAggregator: newArrivalsSliderConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/NewArrivalsSlider')),
        componentShimmer: NewArrivalsSliderShimmer
    },
    magebit_trendingslider: {
        configAggregator: trendingSliderConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/TrendingSlider')),
        componentShimmer: TrendingSliderShimmer
    },
    products: {
        configAggregator: productsConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/Products')),
        componentShimmer: ProductsShimmer
    },
    amblog_widget: {
        configAggregator: amBlogConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/AmblogWidget')),
        componentShimmer: AmblockShimmer
    },
    image: {
        configAggregator: imageConfigAggregator,
        component: React.lazy(() => import(/* WebpackChunkName: "image" */ './ContentTypes/Image'))
    },
    magebit_instagramfeed: {
        configAggregator: instagramFeedConfigAggregator,
        component: React.lazy(() => import('./ContentTypes/InstagramFeed')),
        componentShimmer: InstagramFeedShimmer
    }
};
