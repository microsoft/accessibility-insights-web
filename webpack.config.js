// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const nodeExternals = require('webpack-node-externals');

const commonPlugins = [
    new ForkTsCheckerWebpackPlugin(),
    new CaseSensitivePathsPlugin(),
    new MiniCssExtractPlugin({
        // Similar to the same options in webpackOptions.output
        filename: '[name].css',
        chunkFilename: '[id].css',
    }),
];

const commonEntryFiles = {
    injected: [path.resolve(__dirname, 'src/injected/client-init.ts')],
    popup: [path.resolve(__dirname, 'src/popup/popup-init.ts')],
    insights: [path.resolve(__dirname, 'src/views/insights/initializer.ts')],
    detailsView: [path.resolve(__dirname, 'src/DetailsView/details-view-initializer.ts')],
    devtools: [path.resolve(__dirname, 'src/Devtools/dev-tool-init.ts')],
    background: [path.resolve(__dirname, 'src/background/background-init.ts')],
    serviceWorker: [path.resolve(__dirname, 'src/background/service-worker-init.ts')],
    debugTools: path.resolve(__dirname, 'src/debug-tools/initializer/debug-tools-init.tsx'),
};

const electronEntryFiles = {
    renderer: [path.resolve(__dirname, 'src/electron/views/renderer-initializer.ts')],
    main: [path.resolve(__dirname, 'src/electron/main/main.ts')],
};

const tsRule = {
    test: /\.tsx?$/,
    use: [
        {
            loader: 'ts-loader',
            options: {
                transpileOnly: true,
                experimentalWatchApi: true,
            },
        },
    ],
    exclude: ['/node_modules/'],
};

const scssRule = (useHash = true) => ({
    test: /\.scss$/,
    use: [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                esModule: true,
            },
        },
        {
            loader: 'css-loader',
            options: {
                esModule: true,
                modules: {
                    localIdentName: '[local]' + (useHash ? '--[hash:base64:5]' : ''),
                    exportLocalsConvention: 'camelCaseOnly',
                },
            },
        },
        'sass-loader',
    ],
});

const commonConfig = {
    entry: commonEntryFiles,
    module: {
        rules: [tsRule, scssRule(true)],
    },
    resolve: {
        // It is important that src is absolute but node_modules is relative. See #2520
        modules: [path.resolve(__dirname, './src'), 'node_modules'],
        // We only directly use .tsx and .ts, but some of our transitive dependencies directly
        // require .js or .json files
        extensions: ['.tsx', '.ts', '.js', '.json'],
    },
    plugins: commonPlugins,
    performance: {
        // We allow higher-than-normal sizes because our users only have to do local fetches of our bundles
        maxEntrypointSize: 10 * 1024 * 1024,
        maxAssetSize: 10 * 1024 * 1024,
    },
    stats: {
        // This is to suppress noise from mini-css-extract-plugin
        children: false,
    },
};

const unifiedConfig = {
    ...commonConfig,
    entry: electronEntryFiles,
    name: 'unified',
    mode: 'development',
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'extension/unifiedBundle'),
        filename: '[name].bundle.js',
    },
    node: {
        ...commonConfig.node,
        __dirname: false,
        __filename: false,
    },
    optimization: {
        splitChunks: false,
    },
    target: 'electron-main',
};

const packageUIConfig = {
    entry: {
        ui: [path.resolve(__dirname, 'src/packages/accessibility-insights-ui/index.ts')],
    },
    module: { rules: [tsRule, scssRule(false)] },
    externals: [nodeExternals()],
    plugins: commonPlugins,
    resolve: commonConfig.resolve,
    name: 'package-ui',
    mode: 'development',
    devtool: false,
    output: {
        path: path.join(__dirname, 'packages/ui/bundle'),
        filename: '[name].bundle.js',
        pathinfo: false,
        library: '[name]',
        libraryTarget: 'umd',
    },
    target: 'node',
};

// For just one config, use "webpack --config-name unified", "webpack --config-name package-ui", etc
module.exports = [unifiedConfig, packageUIConfig];
