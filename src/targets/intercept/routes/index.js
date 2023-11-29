/**
 * Map new routes for the project
 */
const { Targetables } = require('@magento/pwa-buildpack');

const makeRoutesTarget = require('./makeRoutesTarget');

module.exports = targets => {
    const app = Targetables.using(targets);
    makeRoutesTarget(app);
};
