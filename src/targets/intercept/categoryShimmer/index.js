const fs = require('fs');
const { Targetables } = require('@magento/pwa-buildpack');

/**
 * Due to RootShimmerTypes being built after overrides are resolved,
 * we need to manually clear categoryContent.shimmer.js file and point to the overridden file.
 *
 * @param targets
 */
module.exports = targets => {
    const targetables = Targetables.using(targets);

    const CategoryShimmerComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/RootComponents/Category/categoryContent.shimmer.js'
    );
    const originalContent = fs
        .readFileSync(require.resolve('@magento/venia-ui/lib/RootComponents/Category/categoryContent.shimmer.js'))
        .toString();

    CategoryShimmerComponent.spliceSource({
        before: 'import React',
        remove: originalContent.length,
        insert: 'export default CategoryContentShimmer'
    });

    CategoryShimmerComponent.addImport(
        'CategoryContentShimmer from "@app/RootComponents/Category/categoryContent.shimmer"'
    );
};
