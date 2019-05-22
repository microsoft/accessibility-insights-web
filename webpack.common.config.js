// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const webpack = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const CaseSensitivePathsPlugin = require('case-sensitive-paths-webpack-plugin');

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
    new CaseSensitivePathsPlugin(),
];

const commonEntryFiles = {
    injected: [path.resolve(__dirname, 'src/injected/stylesheet-init.ts'), path.resolve(__dirname, 'src/injected/client-init.ts')],
    popup: path.resolve(__dirname, 'src/popup/popup-init.ts'),
    insights: [path.resolve(__dirname, 'src/views/insights/initializer.ts')],
    detailsView: [path.resolve(__dirname, 'src/DetailsView/details-view-initializer.ts')],
    devtools: [path.resolve(__dirname, 'src/Devtools/dev-tool-init.ts')],
    background: [path.resolve(__dirname, 'src/background/background-init.ts')],
};

const createCommonConfig = entry => {
    const baseConfig = {
        entry,
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

    return baseConfig;
};

module.exports = {
    commonEntryFiles,
    createCommonConfig,
};
