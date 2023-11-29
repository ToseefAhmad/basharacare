const path = require('path');
const { cachedCleverMerge } = require('webpack/lib/util/cleverMerge');
const PwaStudioOverrideResolverPlugin = require('./lib/PwaStudioOverrideResolverPlugin');
const OverrideStat = require('./lib/OverrideStat');

const resolvers = [
    new PwaStudioOverrideResolverPlugin({
        name: 'VeniaUiOverrideResolverPlugin',
        projectPath: path.resolve('src', 'components', 'overrides'),
        packagePath: path.resolve('node_modules', '@magento', 'venia-ui', 'lib', 'components'),
        overrideStat: OverrideStat.store
    }),
    new PwaStudioOverrideResolverPlugin({
        name: 'PeregrineTalonsOverrideResolverPlugin',
        projectPath: path.resolve('src', 'components', 'overrides'),
        packagePath: path.resolve('node_modules', '@magento', 'peregrine', 'lib', 'talons'),
        overrideStat: OverrideStat.store
    }),
    new PwaStudioOverrideResolverPlugin({
        name: 'PeregrineOverrideResolverPlugin',
        projectPath: path.resolve('src', 'overrides', 'peregrine'),
        packagePath: path.resolve('node_modules', '@magento', 'peregrine', 'lib'),
        overrideStat: OverrideStat.store
    }),
    new PwaStudioOverrideResolverPlugin({
        name: 'PageBuilderOverrideResolverPlugin',
        projectPath: path.resolve('src', 'overrides', 'pagebuilder'),
        packagePath: path.resolve('node_modules', '@magento', 'pagebuilder', 'lib'),
        overrideStat: OverrideStat.store
    }),
    new PwaStudioOverrideResolverPlugin({
        name: 'AmastyBlogOverrideResolverPlugin',
        projectPath: path.resolve('src', 'overrides', '@amasty'),
        packagePath: path.resolve('packages', '@amasty', 'BlogPro', 'src'),
        overrideStat: OverrideStat.store
    })
]

module.exports = targets => {
    const webpackCompiler = targets.of('@magento/pwa-buildpack').webpackCompiler;
    webpackCompiler.tap(compiler =>
        compiler.resolverFactory.hooks.resolveOptions
            .for('normal')
            .tap('AddPwaStudioOverrideResolverPlugin', resolveOptions => {
                const plugin = Object.assign({ plugins: resolvers });
                return cachedCleverMerge(plugin, resolveOptions);
            })
    );
    webpackCompiler.tap(compiler =>
        compiler.resolverFactory.hooks.resolveOptions
            .for('context')
            .tap('AddPwaStudioOverrideResolverPlugin', resolveOptions => {
                const plugin = Object.assign({ plugins: resolvers });
                return cachedCleverMerge(plugin, resolveOptions);
            })
    );
    webpackCompiler.tap(compiler => {
        compiler.hooks.done.tapPromise('OverrideStatLog', async () => {
            compiler.getInfrastructureLogger(`override-stat-log`).info(OverrideStat.formatStat());
        });
    });
};
