const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const UseDetectScrollWidth = targetables.reactComponent('@magento/peregrine/lib/hooks/useDetectScrollWidth.js');

    const peregrineTargets = targets.of('@magento/peregrine');
    const talonsTarget = peregrineTargets.talons;

    talonsTarget.tap(({ MegaMenu, CategoryTree }) => {
        MegaMenu.useMegaMenu.wrapWith('@amasty/blog-pro/targets/wrapUseMegaMenu');
        CategoryTree.useCategoryTree.wrapWith('@amasty/blog-pro/targets/wrapUseCategoryTree');
    });

    // Do not detect as it seems to break element width
    UseDetectScrollWidth.insertAfterSource('export const useDetectScrollWidth = () => {\n', 'return;');
};
