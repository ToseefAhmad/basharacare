const fs = require('fs');

const { merge } = require('lodash');

const extendedDefinitions = require('./definitions.json');
const productionDefinitions = require('./production.json');

module.exports = targets => {
    // Extend upward.yml with customized definitions
    targets.of('@magento/pwa-buildpack').transformUpward.tap(definitions => {
        merge(definitions, extendedDefinitions);
        if (process.env.NODE_ENV === 'production') {
            merge(definitions, productionDefinitions);
        }
    });

    // Move upward.yml from /dist/pwa to /dist so UPWARD plugins can find the file
    targets.of('@magento/pwa-buildpack').webpackCompiler.tap(compiler => {
        if (process.env.NODE_ENV !== 'production') {
            return;
        }
        compiler.hooks.afterEmit.tap('MoveUpwardFile', compilation => {
            const upwardFile = compilation.assets['upward.yml'];
            if (upwardFile && fs.existsSync(upwardFile.existsAt)) {
                const newPath = upwardFile.existsAt.replace('/dist/pwa', '/dist');
                fs.renameSync(upwardFile.existsAt, newPath);
                upwardFile.existsAt = newPath;
            }
        });
    });
};
