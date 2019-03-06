// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');

const commonPlugins = [
    new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1, // Must be greater than or equal to one
        minChunkSize: 1000000,
    }),
    // Be warned: this plugin supports tslint, but enabling it here causes webpack to occasionally
    // process.exit(0) in the middle of execution on mac build machines, resulting in difficult to
    // debug build failures. We aren't quite sure why this is yet, but until it's root caused, keep
    // tslint separate from webpack.
    new ForkTsCheckerWebpackPlugin(),
];

const commonEntryFiles = {
    injected: [path.resolve(__dirname, 'src/injected/stylesheet-init.ts'), path.resolve(__dirname, 'src/injected/client-init.ts')],
    popup: path.resolve(__dirname, 'src/popup/scripts/popup-init.ts'),
    insights: [path.resolve(__dirname, 'src/views/insights/initializer.ts')],
    detailsView: [path.resolve(__dirname, 'src/DetailsView/details-view-initializer.ts')],
    devtools: [path.resolve(__dirname, 'src/devtools/dev-tool-init.ts')],
    background: [path.resolve(__dirname, 'src/background/background-init.ts')],
};

const commonConfig = {
    entry: commonEntryFiles,
    module: {
        rules: [
            {
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
            },
        ],
    },
    resolve: {
        modules: [path.resolve(__dirname, 'node_modules')],
        extensions: ['.tsx', '.ts', '.js'],
    },
    plugins: commonPlugins,
    node: {
        setImmediate: false,
    },
    performance: {
        // We allow higher-than-normal sizes because our users only have to do local fetches of our bundles
        maxEntrypointSize: 10 * 1024 * 1024,
        maxAssetSize: 10 * 1024 * 1024,
    },
};

const devConfig = {
    ...commonConfig,
    name: 'dev',
    mode: 'development',
    devtool: 'source-map',
    output: {
        path: path.join(__dirname, 'extension/devBundle'),
        filename: '[name].bundle.js',
    },
    optimization: {
        splitChunks: false,
    },
};

const prodConfig = {
    ...commonConfig,
    name: 'prod',
    mode: 'production',
    devtool: false,
    output: {
        path: path.join(__dirname, 'extension/prodBundle'),
        filename: '[name].bundle.js',
        pathinfo: false,
    },
    optimization: {
        splitChunks: false,
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: false,
                uglifyOptions: {
                    compress: false,
                    mangle: false,
                    output: {
                        ascii_only: true,
                        comments: /^\**!|@preserve|@license|@cc_on/i,
                        beautify: false,
                    },
                },
            }),
        ],
    },
};

// Use "webpack --config-name dev" or "webpack --config-name prod" to use just one or the other
module.exports = [devConfig, prodConfig];
