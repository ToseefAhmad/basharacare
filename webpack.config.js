const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const { getBuildQueryData } = require('@magebit/pwa-studio-build-query');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

const { configureWebpack, graphQL } = require('@magento/pwa-buildpack');

const { getMediaURL, getStoreConfigData, getPossibleTypes } = graphQL;
const { getAvailableStoresConfigData } = require('./src/buildpack');

const { DefinePlugin } = webpack;

const getCleanTemplate = templateFile => {
    return new Promise(resolve => {
        fs.readFile(templateFile, 'utf8', (err, data) => {
            resolve(
                data
                    .replace(/(?<inlineddata><!-- Inlined Data -->.*\s<!-- \/Inlined Data -->)/gs, '')
                    .replace(/(?<inlineddata><!-- GTM -->.*\s<!-- \/GTM -->)/gs, '')
                    .replace(/(?<inlineddata><!-- GTM NS -->.*\s<!-- \/GTM NS -->)/gs, '')
            );
        });
    });
};

module.exports = async env => {
     /**
     * Set environment mode
     */
    process.env.NODE_ENV = env.mode;
    /**
     * configureWebpack() returns a regular Webpack configuration object.
     * You can customize the build by mutating the object here, as in
     * this example. Since it's a regular Webpack configuration, the object
     * supports the `module.noParse` option in Webpack, documented here:
     * https://webpack.js.org/configuration/module/#modulenoparse
     */
    const config = await configureWebpack({
        context: __dirname,
        vendor: [
            '@apollo/client',
            '@algolia',
            '@babel',
            '@react-aria',
            'apollo-cache-persist',
            'algoliasearch',
            'algoliasearch-helper',
            'informed',
            'react',
            'react-dom',
            'react-feather',
            'react-helmet-async',
            'react-intl',
            'react-instantsearch-core',
            'react-redux',
            'react-router-dom',
            'react-router',
            'react-slick',
            'redux',
            'redux-actions',
            'redux-thunk',
            'search-insights'
        ],
        special: {
            'react-feather': {
                esModules: true
            }
        },
        env
    });

    config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        minSize: 50000,
        maxAsyncRequests: 10,
        maxInitialRequests: 10,
        cacheGroups: {
            pwa: {
                test: /[\\/]node_modules[\\/]@magento\//,
                name: 'pwa',
                chunks: 'all'
            },
            vendor: config.optimization.splitChunks.cacheGroups.vendor,
            default: {
                reuseExistingChunk: true
            }
        }
    }

    const storedData =
        ((!process.env.npm_lifecycle_event || !process.env.npm_lifecycle_event.includes('watch')) &&
            getBuildQueryData()) ||
        null;
    const mediaUrl = (storedData && storedData.mediaUrl) || (await getMediaURL());
    const storeConfigData = (storedData && storedData.storeConfigData) || (await getStoreConfigData());
    const { availableStores } = (storedData && storedData.availableStores) || (await getAvailableStoresConfigData());
    const writeFile = promisify(fs.writeFile);

    /**
     * Loop the available stores when there is provided STORE_VIEW_CODE
     * in the .env file, because should set the store name from the
     * given store code instead of the default one.
     */
    const availableStore = availableStores.find(({ code }) => code === process.env.STORE_VIEW_CODE);

    global.MAGENTO_MEDIA_BACKEND_URL = mediaUrl;
    global.LOCALE = storeConfigData.locale.replace('_', '-');
    global.AVAILABLE_STORE_VIEWS = availableStores;

    const possibleTypes = (storedData && storedData.possibleTypes) || (await getPossibleTypes());

    const htmlWebpackConfig = {
        filename: 'index.html',
        minify: {
            collapseWhitespace: true,
            removeComments: true
        }
    };

    // Strip UPWARD mustache from template file during watch
    if (process.env.npm_lifecycle_event && process.env.npm_lifecycle_event.includes('watch')) {
        const devTemplate = await getCleanTemplate('./template.html');

        // Generate new gitignored html file based on the cleaned template
        await writeFile('template.generated.html', devTemplate);
        htmlWebpackConfig.template = './template.generated.html';
    } else {
        htmlWebpackConfig.template = './template.html';
    }

    config.entry = {
        polyfills: path.join(__dirname, 'src', 'polyfills.js'),
        client: path.join(__dirname, 'src', 'index.js')
    };

    config.module.noParse = [/@adobe\/adobe\-client\-data\-layer/, /braintree\-web\-drop\-in/];
    config.plugins = [
        ...config.plugins,
        new DefinePlugin({
            /**
             * Make sure to add the same constants to
             * the globals object in jest.config.js.
             */
            POSSIBLE_TYPES: JSON.stringify(possibleTypes),
            STORE_NAME: availableStore
                ? JSON.stringify(availableStore.store_name)
                : JSON.stringify(storeConfigData.store_name),
            STORE_VIEW_CODE: process.env.STORE_VIEW_CODE
                ? JSON.stringify(process.env.STORE_VIEW_CODE)
                : JSON.stringify(storeConfigData.code),
            AVAILABLE_STORE_VIEWS: JSON.stringify(availableStores),
            DEFAULT_LOCALE: JSON.stringify(global.LOCALE),
            DEFAULT_COUNTRY_CODE: JSON.stringify(process.env.DEFAULT_COUNTRY_CODE || 'US'),
            ALGOLIA_SEARCH_API_KEY: JSON.stringify(process.env.ALGOLIA_SEARCH_API_KEY || ''),
            ALGOLIA_SEARCH_APP_ID: JSON.stringify(process.env.ALGOLIA_SEARCH_APP_ID || ''),
            ALGOLIA_SEARCH_INDEX_PREFIX: JSON.stringify(process.env.ALGOLIA_SEARCH_INDEX_PREFIX || '')
        }),
        new HTMLWebpackPlugin(htmlWebpackConfig)
    ];

    /**
     * Alias '@app' for the 'src' directory
     */
    config.resolve.alias['@app'] = path.resolve(__dirname, 'src');

    config.module.rules.push({
        test: /\.(woff2?)$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            }
        ]
    });

    // Serve on sub-path, so we can determine it in varnish/nginx
    config.output.publicPath = '/pwa/';
    config.output.path = path.join(__dirname, 'dist', 'pwa');

    return config;
};
