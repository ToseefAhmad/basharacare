const extendIntercept = require('./extend-intercept');

module.exports = targets => {
  targets.of('@magento/pwa-buildpack').specialFeatures.tap(flags => {
    flags[targets.name] = {
      cssModules: true,
      esModules: true,
      graphqlQueries: true
    };
  });

  const peregrineTargets = targets.of('@magento/peregrine');
  const talonsTarget = peregrineTargets.talons;

  talonsTarget.tap(({ FilterModal, FilterSidebar, RootComponents }) => {
    RootComponents.Category.useCategoryContent.wrapWith(
      targets.name + '/targets/wrapUseCategoryContent.js'
    );

    FilterSidebar.useFilterSidebar.wrapWith(
      targets.name + '/targets/wrapUseFilterModal'
    );

    FilterModal.useFilterModal.wrapWith(
      targets.name + '/targets/wrapUseFilterModal'
    );

    FilterModal.useFilterState.wrapWith(
      targets.name + '/targets/wrapUseFilterState'
    );

    FilterModal.useFilterBlock.wrapWith(
      targets.name + '/targets/wrapUseFilterBlock'
    );
  });

  extendIntercept(targets);
};
