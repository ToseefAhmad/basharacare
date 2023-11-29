const { Targetables } = require('@magento/pwa-buildpack');

module.exports = targets => {
    const targetables = Targetables.using(targets);

    const MagentoRouteComponent = targetables.reactComponent(
        '@magento/venia-ui/lib/components/MagentoRoute/magentoRoute.js'
    );

    // Replace error message
    MagentoRouteComponent.spliceSource({
        after: '} else if (isNotFound) {\n' + '        return (\n' + '            <ErrorView\n',
        remove: 174
    });
};
