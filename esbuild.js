// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

const path = require('path');
const { argv } = require('process');
const NodeResolve = require('@esbuild-plugins/node-resolve');
const esbuild = require('esbuild');
const yargs = require('yargs');
const { CreateStylePlugin } = require('./style-plugin');

const src = './src';
const argsObj = yargs(argv).argv;

const electronEntryFiles = {
    renderer: [path.resolve(__dirname, 'src/electron/views/renderer-initializer.ts')],
    main: [path.resolve(__dirname, 'src/electron/main/main.ts')],
};
const unifiedOutdir = path.join(__dirname, 'extension/unifiedBundle');

const webExtensionEntryFiles = {
    background: `${src}/background/background-init.ts`,
    injected: `${src}/injected/client-init.ts`,
    popup: `${src}/popup/popup-init.ts`,
    insights: `${src}/views/insights/initializer.ts`,
    detailsView: `${src}/DetailsView/details-view-initializer.ts`,
    devtools: `${src}/Devtools/dev-tool-init.ts`,
    serviceWorker: `${src}/background/service-worker-init.ts`,
    debugTools: `${src}/debug-tools/initializer/debug-tools-init.tsx`,
};
const devWebExtensionOutdir = path.join(__dirname, 'extension/devBundle');
const devWebExtensionM3Outdir = path.join(__dirname, 'extension/devMv3Bundle');

const prodWebExtensionOutDir = path.join(__dirname, 'extension/prodBundle');
const prodWebExtensionM3OutDir = path.join(__dirname, 'extension/prodMv3Bundle');

function isReactDevtoolsInstalled() {
    try {
        require.resolve('react-devtools');
        return true;
    } catch (error) {
        if (error.code === 'MODULE_NOT_FOUND') {
            return false;
        } else {
            throw error;
        }
    }
}

function checkToAddReactDevTools(givenEntryFiles) {
    if (isReactDevtoolsInstalled()) {
        givenEntryFiles.detailsView = `${src}/DetailsView/details-view-init-with-react-devtools.ts`;
        givenEntryFiles.popup = `${src}/popup/popup-init-with-react-devtools.ts`;
    }
}

function ignoreNodeModules(givenPlugins) {
    // esbuild doesn't have an easy way to ignore node_modules for monorepos,
    // so this plugin is necessary (marks all node_modules as external).
    // Thread: https://github.com/evanw/esbuild/issues/619
    givenPlugins.push(
        NodeResolve.NodeResolvePlugin({
            extensions: ['.ts', '.tsx', '.js'],
            onResolved: resolved => {
                if (resolved.includes('node_modules')) {
                    return {
                        external: true,
                    };
                }
                return resolved;
            },
        }),
    );
}

// Default behavior; builds dev extension.
let entryFiles = webExtensionEntryFiles;
let outdir = devWebExtensionOutdir;
let isProd = false;
let platform = 'browser';
let external = [];
let format = 'iife';
let define;
let target = ['chrome90', 'firefox90'];
let plugins = [CreateStylePlugin()];
let minify = false;
let sourcemap = true;

switch (argsObj.env) {
    // Note: currently causes errors when electron app is run.
    case 'unified':
        entryFiles = electronEntryFiles;
        outdir = unifiedOutdir;
        platform = 'node';
        external = [];
        format = 'cjs';
        break;

    case 'prod':
        minify = true;
        sourcemap = false;
        outdir = prodWebExtensionOutDir;
        break;

    case 'prod-mv3':
        minify = true;
        sourcemap = false;
        outdir = prodWebExtensionM3OutDir;
        define = {
            global: 'globalThis',
        };
        break;

    case 'dev-mv3':
        outdir = devWebExtensionM3Outdir;
        define = {
            global: 'globalThis',
        };
        checkToAddReactDevTools(entryFiles);

        break;

    case 'report':
        entryFiles = { report: `${src}/reports/package/reporter-factory.ts` };
        outdir = path.join(__dirname, 'packages/report/bundle');
        format = 'cjs';

        ignoreNodeModules(plugins);

        break;

    case 'validator':
        entryFiles = {
            validator: `${src}/packages/assessment-validator/index.ts`,
        };
        outdir = path.join(__dirname, 'packages/validator/bundle');
        platform = 'node';

        ignoreNodeModules(plugins);

        break;

    // dev web extension
    default:
        checkToAddReactDevTools(entryFiles);
        break;
}

const config = {
    plugins,
    entryPoints: entryFiles,
    format,
    platform,
    external,
    outbase: src,
    bundle: true,
    minify: minify,
    sourcemap: sourcemap,
    target,
    outdir: outdir,
    outExtension: {
        '.js': '.bundle.js',
    },
    watch: argv.includes('--watch'),
    logLevel: 'info',
    define,
};

esbuild.build(config).catch(e => {
    console.error(e);
    process.exit(1);
});
