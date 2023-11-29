/**
 * List of interceptors
 */
const interceptors = [
    require('./categoryShimmer'),
    require('./routes'),
    require('./upward'),
    require('./errorMessage'),
    require('./scrollWidth')
];

/**
 * Register new interceptors here
 * @param targets
 */
module.exports = targets => {
    interceptors.forEach(interceptor => {
        interceptor(targets);
    });
};
