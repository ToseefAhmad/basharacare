import { CacheableResponsePlugin } from 'workbox-cacheable-response';
import { ExpirationPlugin } from 'workbox-expiration';
import { CacheFirst } from 'workbox-strategies';

import { THIRTY_DAYS, IMAGES_CACHE_NAME, MAX_NUM_OF_IMAGES_TO_CACHE } from '../defaults';

import { MESSAGE_TYPES } from '@magento/peregrine/lib/util/swUtils';

import { registerMessageHandler } from './messageHandler';
import { isFastNetwork } from './networkUtils';

const imageRegex = new RegExp(/\.(?:png|jpg|jpeg)$/);

// Get width for image from CDN that looks like "width=640" in URL
const getWidthFromCDNImage = url => {
    // Regex to match anything like "width=640", "width=1", width="23" and etc
    const widthRegex = new RegExp(/(width=\d+)/g);

    // Match the regex to find "width=640" and remove "width=" from it to only get the actual width like "640"
    let width;
    const matchedWidth = url.pathname.match(widthRegex);

    if (matchedWidth) {
        width = Number(matchedWidth[0].replace('width=', ''));
    }

    return width;
};

const getWidth = url => {
    // Checks the image's URL if it contains CDN path from CloudFlare
    // "/cdn-cgi/image/format=auto,width=640,height=640,fit=cover/media/catalog/product/2/0/2022_ra_gold_1.jpg"
    const isImageUrlContainsCDN = url.pathname.includes('/cdn-cgi/image/');

    if (isImageUrlContainsCDN) {
        return getWidthFromCDNImage(url);
    }

    // Default PWA Studio implementation
    const urlSearchParams = new URLSearchParams(url.search);
    const width = urlSearchParams.has('width') ? Number(urlSearchParams.get('width')) : NaN;

    return width;
};

const isImage = url => imageRegex.test(url.pathname);

/**
 * IsResizedImage is route checker for workbox
 * that returns true for a valid resized image URL.
 *
 * @param {url: URL, event: FetchEvent} workboxRouteObject
 *
 * @returns {boolean}
 */
export const isResizedImage = ({ url }) => isImage(url) && !isNaN(getWidth(url));

/**
 * This function tries to find same or a larger image
 * from the images cache storage.
 *
 * @param {URL} url
 *
 * @returns {Promise | undefined} A promise that resolves to a valid response
 * object from cache or undefined if the a match could not be found.
 */
export const findSameImage = async url => {
    const requestedWidth = getWidth(url);
    const requestedFilename = url.pathname.split('/').reverse()[0];

    const cache = await caches.open(IMAGES_CACHE_NAME);
    const cachedURLs = await cache.keys();
    const cachedSources = await cachedURLs.filter(({ url }) => {
        const cachedFileName = new URL(url).pathname.split('/').reverse()[0];

        return cachedFileName === requestedFilename;
    });

    // Find the cached version of this image that is closest to the requested
    // Width without going under it.
    for (const candidate of cachedSources) {
        const width = getWidth(new URL(candidate.url));
        /**
         * If the cached image has no resize param continue because
         * we can't safely use it
         */
        if (isNaN(width)) {
            continue;
        }

        const difference = width - requestedWidth;

        /**
         * If cached image is smaller than requested continue because
         * we can't safely use it
         */
        if (difference < 0) {
            continue;
        }

        /**
         * If the cached image is same as what we are looking for, return.
         */
        if (difference === 0) {
            return await cache.match(candidate);
        }
    }
};

const fetchAndCacheImage = imageURL =>
    fetch(imageURL, { mode: 'no-cors' }).then(response =>
        caches
            .open(IMAGES_CACHE_NAME)
            .then(cache => cache.put(imageURL, response.clone()))
            .then(() => response)
    );

const fetchIfNotCached = imageURL =>
    new Promise(resolve => {
        caches.match(imageURL).then(res => {
            res ? resolve(res) : resolve(fetchAndCacheImage(imageURL));
        });
    });

const handleImagePreFetchRequest = (payload, event) => {
    if (isFastNetwork()) {
        return Promise.all(payload.urls.map(fetchIfNotCached))
            .then(responses => {
                event.ports[0].postMessage({ status: 'done' });
                return responses;
            })
            .catch(err => {
                event.ports[0].postMessage({
                    status: 'error',
                    message: JSON.stringify(err)
                });
                return null;
            });
    } else {
        event.ports[0].postMessage({
            status: 'error',
            message: `Slow Network detected. Not pre-fetching images. ${payload.urls}`
        });
        return null;
    }
};

/**
 * This function registers all message handlers related to
 * image prefetching.
 *
 * Messages it registers handlers to:
 *
 * 1. PREFETCH_IMAGES
 */
export const registerImagePreFetchHandler = () => {
    registerMessageHandler(MESSAGE_TYPES.PREFETCH_IMAGES, handleImagePreFetchRequest);
};

/**
 * This function creates a handler that workbox can use
 * to handle all images.
 */
export const createImageCacheHandler = () =>
    new CacheFirst({
        cacheName: IMAGES_CACHE_NAME,
        plugins: [
            new ExpirationPlugin({
                maxEntries: MAX_NUM_OF_IMAGES_TO_CACHE,
                maxAgeSeconds: THIRTY_DAYS,
                matchOptions: {
                    ignoreVary: true
                }
            }),
            new CacheableResponsePlugin({
                statuses: [0, 200]
            })
        ]
    });
