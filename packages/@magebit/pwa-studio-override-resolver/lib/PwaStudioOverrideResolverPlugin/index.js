const fs = require('fs');
const path = require('path');

const MODULE_OVERRIDE_FILE_NAME = 'module-override.json';

function readConfigFile(configPath) {
    let config = {};
    try {
        const stat = fs.statSync(configPath);
        if (stat && stat.isFile()) {
            config = JSON.parse(fs.readFileSync(configPath));
        }
    } catch (e) {
        config = {};
    }
    return config;
}

class PwaStudioOverrideResolverPlugin {
    constructor(options) {
        this.name = options.name || 'PwaStudioOverrideResolverPlugin';
        this.basePath = options.basePath || path.resolve();
        this.projectPath = options.projectPath;
        this.packagePath = options.packagePath;
        this.overrideStat = options.overrideStat;
        this.moduleOverrideConfigFile = path.resolve(this.projectPath, MODULE_OVERRIDE_FILE_NAME);
    }

    apply(resolver) {
        const target = resolver.ensureHook('resolved');
        const moduleOverridePaths = readConfigFile(this.moduleOverrideConfigFile);
        resolver
            .getHook('existingFile')
            .tapAsync(this.name, (request, resolveContext, callback) => {
                const current = request.path;
                if (!current) {
                    return callback();
                }

                let newModule;
                Object.keys(moduleOverridePaths).forEach((origPath) => {
                    if (current === path.resolve(this.packagePath, origPath, 'index.js').trim('/')) {
                        newModule = path.resolve(moduleOverridePaths[origPath], 'index.ts');
                    }
                });

                if (newModule) {
                    fs.stat(newModule, (err, stat) => {
                        if (!err && stat && stat.isFile()) {
                            const obj = {
                                ...request,
                                path: newModule,
                                request: undefined
                            };
                            this.overrideStat(current, newModule);
                            return resolver.doResolve(
                                target,
                                obj,
                                `resolved by ${this.name} to ${newModule}`,
                                resolveContext,
                                callback
                            );
                        }
                        return callback();
                    });
                } else if (current.startsWith(this.packagePath)) {
                    const newFile = current.replace(this.packagePath, this.projectPath);
                    fs.stat(newFile, (err, stat) => {
                        if (!err && stat && stat.isFile()) {
                            const obj = {
                                ...request,
                                path: newFile,
                                request: undefined
                            };
                            this.overrideStat(current, newFile);
                            return resolver.doResolve(
                                target,
                                obj,
                                `resolved by ${this.name} to ${newFile}`,
                                resolveContext,
                                callback
                            );
                        }
                        return callback();
                    });
                } else {
                    return callback();
                }
            });
    }
}

module.exports = PwaStudioOverrideResolverPlugin;
