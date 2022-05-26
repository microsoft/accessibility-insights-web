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

function checkToAddReactDevTools(entryFiles) {
    if (isReactDevtoolsInstalled()) {
        entryFiles.detailsView = `${src}/DetailsView/details-view-init-with-react-devtools.ts`;
        entryFiles.popup = `${src}/popup/popup-init-with-react-devtools.ts`;
    }
}

// Default behavior; builds dev extension.
let entryFiles = webExtensionEntryFiles;
let outdir = devWebExtensionOutdir;
let isProd = false;
let platform = 'browser';
let external = [];
let format = 'esm';
let define;
let target = ['chrome90', 'firefox90'];
let plugins = [CreateStylePlugin()];

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
        isProd = true;
        outdir = prodWebExtensionOutDir;
        delete entryFiles.detailsView;
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

        // esbuild doesn't have an easy way to ignore node_modules for monorepos,
        // so this plugin is necessary (marks all node_modules as external).
        // Thread: https://github.com/evanw/esbuild/issues/619
        plugins.push(
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
    minify: isProd,
    sourcemap: !isProd,
    target,
    outdir: outdir,
    outExtension: {
        '.js': '.bundle.js',
    },
    watch: argv.includes('--watch'),
    logLevel: 'info',
    define,
};

esbuild
    .build(config)
    .then(() => {
        if (!isProd) {
            return;
        }

        // minification of the details-view bundle can lead to a collision with the axe-core
        // package, so we do not minify the identifiers specifically for the details-view bundle.
        config.entryPoints = {
            detailsView: `${src}/DetailsView/details-view-initializer.ts`,
        };
        config.minify = false;
        config.minifyWhitespace = true;
        config.minifySyntax = true;
        esbuild.build(config).catch(console.error);
    })
    .catch(console.error);
